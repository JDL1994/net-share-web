'use server';

import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/app/api/db/knowledge.json');

interface Document {
  id: number;
  title: string;
  url: string;
  type: string;
  description: string;
  updateTime: string;
}

// 读取数据
async function readDb() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

// 写入数据
async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// 获取所有文档
export async function getDocuments() {
  const db = await readDb();
  return db.documents;
}

// 添加文档
export async function addDocument(document: Omit<Document, 'id'>) {
  const db = await readDb();
  const newId = Math.max(0, ...db.documents.map((d: Document) => d.id)) + 1;
  const newDocument = { ...document, id: newId };
  db.documents.push(newDocument);
  await writeDb(db);
  return newDocument;
}

// 更新文档
export async function updateDocument(id: number, document: Partial<Document>) {
  const db = await readDb();
  const index = db.documents.findIndex((d: Document) => d.id === id);
  if (index === -1) throw new Error('Document not found');
  
  db.documents[index] = { ...db.documents[index], ...document };
  await writeDb(db);
  return db.documents[index];
}

// 删除文档
export async function deleteDocument(id: number) {
  const db = await readDb();
  const index = db.documents.findIndex((d: Document) => d.id === id);
  if (index === -1) throw new Error('Document not found');
  
  db.documents.splice(index, 1);
  await writeDb(db);
} 