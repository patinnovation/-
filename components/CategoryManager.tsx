import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../hooks/useAppStore';

const CategoryManager: React.FC = () => {
    const { categories, menu } = useAppState();
    const dispatch = useAppDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [error, setError] = useState('');

    const openModal = (category: string | null = null) => {
        setCurrentCategory(category);
        setNewCategoryName(category || '');
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setNewCategoryName('');
        setError('');
    };

    const handleSave = () => {
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) {
            setError('ชื่อหมวดหมู่ห้ามว่าง');
            return;
        }
        if (categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase() && cat !== currentCategory)) {
            setError('มีหมวดหมู่นี้อยู่แล้ว');
            return;
        }

        if (currentCategory) {
            dispatch({ type: 'UPDATE_CATEGORY', payload: { oldName: currentCategory, newName: trimmedName } });
        } else {
            dispatch({ type: 'ADD_CATEGORY', payload: { name: trimmedName } });
        }
        closeModal();
    };

    const handleDelete = (categoryName: string) => {
        const isUsed = menu.some(item => item.category === categoryName);
        if (isUsed) {
            alert('ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากมีรายการอาหารใช้งานอยู่');
            return;
        }
        if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${categoryName}"?`)) {
            dispatch({ type: 'DELETE_CATEGORY', payload: { name: categoryName } });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-brand-dark">จัดการหมวดหมู่</h2>
                <button onClick={() => openModal()} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    เพิ่มหมวดหมู่ใหม่
                </button>
            </div>
            <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
                        <span>{cat}</span>
                        <button onClick={() => openModal(cat)} className="text-gray-400 hover:text-blue-600" aria-label={`Edit ${cat}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                            </svg>
                        </button>
                        <button onClick={() => handleDelete(cat)} className="text-gray-400 hover:text-red-600" aria-label={`Delete ${cat}`}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{currentCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</h3>
                        <div>
                             <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">ชื่อหมวดหมู่</label>
                            <input
                                id="categoryName"
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                ยกเลิก
                            </button>
                            <button onClick={handleSave} className="bg-brand-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded">
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
