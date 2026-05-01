import { FileText, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useTemplateStore } from '../stores/templateStore';
import { useQuoteStore } from '../stores/quoteStore';
import { useAppStore } from '../stores/appStore';
import { Button } from '../components/Button';
import { useState } from 'react';
import type { Template } from '../types';

export function Templates() {
  const { templates, deleteTemplate, renameTemplate } = useTemplateStore();
  const { loadTemplate } = useQuoteStore();
  const { setActiveTab } = useAppStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleUseTemplate = (template: Template) => {
    loadTemplate(template.lineItems, template.defaultNotes);
    setActiveTab('builder');
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      renameTemplate(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:ml-64">
      <div className="max-w-lg mx-auto p-4 md:max-w-2xl">
        <h1 className="font-bold text-2xl text-secondary mb-1">Templates</h1>
        <p className="text-text-secondary text-sm mb-6">Quick access to your saved quote templates</p>

        {templates.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <h3 className="font-semibold text-lg text-secondary mb-2">No templates yet</h3>
            <p className="text-text-secondary text-sm mb-4">Save a quote as a template to quickly reuse it later.</p>
            <Button onClick={() => setActiveTab('builder')}><Plus size={18} /> Create Quote</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                {editingId === template.id ? (
                  <div className="flex gap-2">
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 h-10 px-3 border border-gray-200 rounded-lg" autoFocus />
                    <Button size="sm" onClick={() => handleSaveRename(template.id)}><Check size={16} /></Button>
                  </div>
                ) : confirmDelete === template.id ? (
                  <div className="flex items-center gap-3">
                    <p className="flex-1 text-sm">Delete "{template.name}"?</p>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button size="sm" onClick={() => { deleteTemplate(template.id); setConfirmDelete(null); }}>Delete</Button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary truncate">{template.name}</h3>
                      <p className="text-text-secondary text-xs">{template.lineItems.length} items</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingId(template.id); setEditName(template.name); }} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-text-secondary">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setConfirmDelete(template.id)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-error">
                        <Trash2 size={16} />
                      </button>
                      <Button size="sm" onClick={() => handleUseTemplate(template)}>Use</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}