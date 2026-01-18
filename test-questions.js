import HRAgent from '../src/lib/hr-agent';

async function runTests() {
  const agent = new HRAgent();
  await agent.initialize();

  const testQuestions = [
    "¿Cuál es el monto de cesantías para el empleado con documento 124473?",
    "¿Cuántos empleados tienen cesantías causadas?",
    "¿Qué son las cesantías y cuándo se pagan?",
    "¿Cuál es el promedio de cesantías pagadas?"
  ];

  const results = [];

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`\n=== PREGUNTA ${i + 1} ===`);
    console.log(`Pregunta: ${question}`);
    
    const result = await agent.processQuestion(question);
    
    console.log(`Acción: ${result.action}`);
    console.log(`Respuesta: ${result.answer}`);
    console.log(`Pensamiento: ${result.thinking}`);
    
    results.push({
      questionNumber: i + 1,
      question,
      action: result.action,
      answer: result.answer,
      thinking: result.thinking
    });
  }

  return results;
}

runTests().then(results => {
  console.log('\n=== RESUMEN DE PRUEBAS COMPLETADO ===');
  console.log('Resultados guardados en memoria para documentación');
}).catch(error => {
  console.error('Error en las pruebas:', error);
});