import { MongoClient } from 'mongodb';

async function seed() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('expanders_quest');

  const researchDocs = [
    {
      projectId: 1,
      title: 'US Market Trends',
      content: 'Research on US market trends...',
      tags: ['US', 'market', '2025'],
    },
    {
      projectId: 1,
      title: 'Competitor Analysis',
      content: 'Analysis of competitors in the US...',
      tags: ['analysis', 'competitor'],
    },
  ];

  await db.collection('research').deleteMany({});
  await db.collection('research').insertMany(researchDocs);

  console.log('MongoDB seeded!');
  await client.close();
}

seed();
