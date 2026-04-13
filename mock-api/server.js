const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3333;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "mock-api-emissao" });
});

app.post("/api/emissao/iniciar", (req, res) => {
  const { acNome, cpf, nome, dataNascimento, flagCapturaDocumento } = req.body;

  if (!cpf || !nome || !dataNascimento) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Campos obrigatórios não informados"
    });
  }

  return res.status(200).json({
    protocolo: `EMI-${Date.now()}`,
    acTipo: acNome === "Safeweb" ? "AR qualquer coisa" : acNome,
    flagCapturaDocumento: !!flagCapturaDocumento,
    proximaEtapa: "biometria"
  });
});

app.post("/api/biometria/validar", async (req, res) => {
  const scenario = req.query.scenario || "success";

  if (scenario === "timeout") {
    await delay(5000);
    return res.status(504).json({
      code: "TIMEOUT",
      message: "Biometria indisponível"
    });
  }

  if (scenario === "reprovada") {
    return res.status(200).json({
      status: "REPROVADA",
      score: 42,
      message: "Biometria não validada"
    });
  }

  if (scenario === "erro") {
    return res.status(500).json({
      code: "PSBIO_ERROR",
      message: "Erro interno no processamento biométrico"
    });
  }

  return res.status(200).json({
    status: "APROVADA",
    score: 98,
    message: "Biometria validada com sucesso"
  });
});

app.post("/api/conformidade/analisar", (req, res) => {
  const scenario = req.query.scenario || "aprovada";

  if (scenario === "pendente") {
    return res.status(200).json({
      status: "PENDENTE",
      message: "Análise pendente de revisão manual"
    });
  }

  if (scenario === "reprovada") {
    return res.status(200).json({
      status: "REPROVADA",
      message: "Documentação inconsistente"
    });
  }

  if (scenario === "erro") {
    return res.status(500).json({
      code: "CONFORMIDADE_ERROR",
      message: "Falha ao analisar conformidade"
    });
  }

  return res.status(200).json({
    status: "APROVADA",
    message: "Conformidade aprovada"
  });
});

app.post("/api/transmissao/enviar", async (req, res) => {
  const scenario = req.query.scenario || "success";

  if (scenario === "timeout") {
    await delay(4000);
    return res.status(504).json({
      code: "TRANSMISSAO_TIMEOUT",
      message: "Tempo excedido na transmissão"
    });
  }

  if (scenario === "erro") {
    return res.status(502).json({
      code: "TRANSMISSAO_ERROR",
      message: "Falha ao transmitir solicitação"
    });
  }

  return res.status(200).json({
    status: "ENVIADA",
    protocoloTransmissao: `TR-${Date.now()}`,
    message: "Transmissão concluída com sucesso"
  });
});

app.listen(port, () => {
  console.log(`Mock API rodando em http://localhost:${port}`);
});