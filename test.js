const fetch = require('node-fetch');

async function getBody() {
  const response = await fetch(
    'https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy'
  );
  const data = await response.json();
  const dataWithPolices = await addPolices(data);
  console.log(dataWithPolices);
  console.log(dataWithPolices.policy.workers[0]);
}

getBody();

const addPolices = (body) => {
  const workersWithCoberturaDental = body.policy.workers[0].map((worker) => {
    let age = worker.age;
    let childs = worker.childs;
    let costSaludVida = 0.279;
    let cosDental = 0.12;
    let costoTotalPoliza = 0;

    if (childs !== 0) {
      costSaludVida = 0.4396;
      cosDental = 0.195;
    }
    if (childs > 1) {
      costSaludVida = 0.5599;
      cosDental = 0.248;
    }
    if (age >= 65) {
      cosDental = 0;
      costSaludVida = 0;
    }
    if (!body.policy.has_dental_care) {
      cosDental = 0;
    }

    costoTotalPoliza = cosDental + costSaludVida;
    costoTotalPoliza =
      (costoTotalPoliza * body.policy.company_percentage) / 100;

    return { age, childs, costSaludVida, cosDental, costoTotalPoliza };
  });

  body.policy.workers[0] = workersWithCoberturaDental;
  return body;
};
