const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.DB_CONNECTION_STRING;
const fixturePath = path.join(__dirname, 'sample-posts.json');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  likedBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, default: 'Untitled post' },
  content: { type: String, required: true },
  attachment: {
    type: {
      type: String,
      enum: ['image', 'audio', 'video', 'text', 'repost'],
      default: null
    },
    name: { type: String, default: '' },
    url: { type: String, default: '' },
    text: { type: String, default: '' },
    originalPostId: { type: mongoose.Schema.Types.ObjectId, default: null }
  },
  likedBy: [{ type: String }],
  replies: [commentSchema],
  hiddenBy: [{ type: String }],
  blockedBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('SeedPost', postSchema, 'posts');

function buildDocMap(rawPosts) {
  const docMap = new Map();

  rawPosts.forEach((item, index) => {
    docMap.set(item.seedKey, new mongoose.Types.ObjectId());
    if (index === rawPosts.length - 1) {
      return;
    }
  });

  return docMap;
}

function buildPostDocument(item, docMap) {
  const attachment = item.attachment
    ? {
        type: item.attachment.type || null,
        name: item.attachment.name || '',
        url: item.attachment.url || '',
        text: item.attachment.text || '',
        originalPostId: item.attachment.originalSeedKey ? docMap.get(item.attachment.originalSeedKey) : null
      }
    : null;

  return {
    _id: docMap.get(item.seedKey),
    userId: item.userId,
    title: item.title,
    content: item.content,
    attachment,
    likedBy: Array.isArray(item.likedBy) ? item.likedBy : [],
    replies: Array.isArray(item.replies) ? item.replies : [],
    hiddenBy: [],
    blockedBy: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error('DB_CONNECTION_STRING is missing');
  }

  const raw = fs.readFileSync(fixturePath, 'utf8');
  const fixture = JSON.parse(raw);

  await mongoose.connect(MONGODB_URI, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    minPoolSize: 2
  });

  const existing = await Post.find({
    $or: fixture.map(item => ({
      userId: item.userId,
      title: item.title,
      content: item.content
    }))
  }).lean();

  const existingKeys = new Set(existing.map(post => `${post.userId}::${post.title}::${post.content}`));
  const docMap = buildDocMap(fixture);
  const toInsert = fixture
    .filter(item => !existingKeys.has(`${item.userId}::${item.title}::${item.content}`))
    .map(item => buildPostDocument(item, docMap));

  if (toInsert.length === 0) {
    console.log('No new seed posts to insert.');
    return;
  }

  await Post.insertMany(toInsert);
  console.log(`Inserted ${toInsert.length} seed posts.`);
}

main()
  .catch(error => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });