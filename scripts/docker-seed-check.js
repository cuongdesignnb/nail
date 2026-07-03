const { PrismaClient } = require('./node_modules/.prisma/client');
const p = new PrismaClient();

async function main() {
  const result = await p.businessSetting.upsert({
    where: { key: 'default' },
    update: {},
    create: { key: 'default', timezone: 'America/Los_Angeles', currency: 'USD' }
  });
  console.log('BusinessSetting:', JSON.stringify(result));
  
  // Check if db has the new schema columns
  const count = await p.booking.count();
  console.log('Total bookings in DB:', count);
  
  const techCount = await p.technician.count();
  console.log('Total technicians:', techCount);
  
  const customerCount = await p.customer.count();
  console.log('Total customers:', customerCount);
  
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
