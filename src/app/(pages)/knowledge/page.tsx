'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Image from 'next/image';
import { getDocuments, updateDocument, addDocument, deleteDocument } from '@/app/actions/knowledge';

interface Document {
  id: number;
  title: string;
  url: string;
  type: string;
  description: string;
  updateTime: string;
}

interface FormData {
  title: string;
  url: string;
  type: string;
  description: string;
  updateTime: string;
}

const initialFormData: FormData = {
  title: '',
  url: '',
  type: 'feishu',
  description: '',
  updateTime: new Date().toISOString().split('T')[0]
};

const DocumentFormInput = memo(({ 
  id, 
  name, 
  label, 
  type = 'text',
  value, 
  onChange,
  rows
}: { 
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows?: number;
}) => {
  if (type === 'textarea') {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={rows || 3}
          required
        />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>
  );
});

DocumentFormInput.displayName = 'DocumentFormInput';

const DocumentForm = memo(({ 
  onSubmit, 
  buttonText,
  formData,
  onInputChange,
  onCancel
}: { 
  onSubmit: (e: React.FormEvent) => Promise<void>;
  buttonText: string;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
}) => (
  <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-lg">
    <div className="space-y-4">
      <DocumentFormInput
        id="title"
        name="title"
        label="标题"
        value={formData.title}
        onChange={onInputChange}
      />
      <DocumentFormInput
        id="url"
        name="url"
        label="链接"
        type="url"
        value={formData.url}
        onChange={onInputChange}
      />
      <DocumentFormInput
        id="description"
        name="description"
        label="描述"
        type="textarea"
        value={formData.description}
        onChange={onInputChange}
        rows={3}
      />
      <DocumentFormInput
        id="updateTime"
        name="updateTime"
        label="更新时间"
        type="date"
        value={formData.updateTime}
        onChange={onInputChange}
      />
    </div>
    <div className="mt-6 flex justify-end space-x-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        取消
      </button>
      <button
        type="submit"
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        {buttonText}
      </button>
    </div>
  </form>
));

DocumentForm.displayName = 'DocumentForm';

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const loadDocuments = useCallback(async () => {
    const docs = await getDocuments();
    setDocuments(docs);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    if (editingDoc) {
      const { id, ...rest } = editingDoc;
      setFormData(rest);
    }
  }, [editingDoc]);

  const handleEdit = useCallback((doc: Document) => {
    setEditingDoc(doc);
    setIsEditing(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      await updateDocument(editingDoc.id, formData);
      setIsEditing(false);
      setEditingDoc(null);
      setFormData(initialFormData);
      loadDocuments();
    }
  }, [editingDoc, formData, loadDocuments]);

  const handleAdd = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await addDocument(formData);
    setShowAddForm(false);
    setEditingDoc(null);
    setFormData(initialFormData);
    loadDocuments();
  }, [formData, loadDocuments]);

  const handleDelete = useCallback(async (id: number) => {
    if (confirm('确定要删除这个文档吗？')) {
      await deleteDocument(id);
      loadDocuments();
    }
  }, [loadDocuments]);

  const handleAddNew = useCallback(() => {
    setFormData(initialFormData);
    setShowAddForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setShowAddForm(false);
    setEditingDoc(null);
    setFormData(initialFormData);
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="relative h-[300px] mb-12">
        <Image
          src="/images/knowledge.jpg"
          alt="Knowledge sharing background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">知识分享</h1>
            <p className="text-xl max-w-2xl">分享团队经验，传递实践智慧</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加文档
          </button>
        </div>

        {/* Edit/Add Form Modal */}
        {(isEditing || showAddForm) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full">
              <DocumentForm 
                onSubmit={showAddForm ? handleAdd : handleSave}
                buttonText={showAddForm ? "添加" : "保存"}
                formData={formData}
                onInputChange={handleInputChange}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Documents Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
            >
              {/* Document Content */}
              <a 
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="aspect-video relative bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                      className="w-16 h-16 text-blue-500 group-hover:scale-110 transition-transform" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.568.075c2.202 1.174 4.046 2.915 5.223 5.116h-5.223V.075zm-1.161-.05v5.141H7.191c1.178-2.2 3.021-3.942 5.216-5.116v-.025zM7.191 6.232h6.216v5.141H7.191V6.232zm7.377 0h5.223v5.141h-5.223V6.232zM7.191 12.44h6.216v5.141H7.191V12.44zm7.377 0h5.223v5.141h-5.223V12.44zM7.191 18.647h6.216v5.141c-2.195-1.174-4.038-2.915-5.216-5.116h-1v-.025zm7.377 0h5.223c-1.177 2.201-3.021 3.942-5.223 5.116v-5.116z"/>
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg 
                      className="w-5 h-5 text-blue-500" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
                    </svg>
                    <span className="text-sm text-gray-500">飞书文档</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">更新于 {doc.updateTime}</span>
                    </div>
                    <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      查看文档
                      <svg 
                        className="w-4 h-4 ml-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>

              {/* Edit/Delete Buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(doc);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 bg-white rounded-full shadow-md hover:shadow-lg transition-all mr-2"
                  title="编辑"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(doc.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="删除"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 