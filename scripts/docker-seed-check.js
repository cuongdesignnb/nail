const { PrismaClient } = require('./node_modules/.prisma/client');
const p = new PrismaClient();

async function main() {
  const counts = {
    technicians: await p.technician.count(),
    reviews: await p.review.count(),
    inventoryItems: await p.inventoryItem.count(),
    bookings: await p.booking.count(),
    customers: await p.customer.count(),
    services: await p.service.count(),
    businessSettings: await p.businessSetting.count(),
    payments: await p.payment.count(),
  };
  console.log('DB Data Counts:', JSON.stringify(counts, null, 2));
  
  // Check new columns exist
  const booking = await p.booking.findFirst();
  if (booking) {
    console.log('Sample booking fields:', Object.keys(booking).join(', '));
  }
  
  const payment = await p.payment.findFirst();
  if (payment) {
    console.log('Sample payment fields:', Object.keys(payment).join(', '));
  }
  
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
