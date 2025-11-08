import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../hooks/useAppStore';
import { MenuItem } from '../types';
import { MENU_CATEGORIES } from '../constants';

const MenuEditorPage: React.FC = () => {
    const { menu } = useAppState();
    const dispatch = useAppDispatch();
    
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formState, setFormState] = useState({
        name: '',
        price: '',
        category: MENU_CATEGORIES[0],
        image: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormState(prev => ({ ...prev, image: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(formState.price);
        if (!formState.name || isNaN(price) || price <= 0) {
            alert('Please fill in all fields correctly.');
            return;
        }

        if (editingItem) {
            dispatch({
                type: 'UPDATE_MENU_ITEM',
                payload: { ...editingItem, ...formState, price }
            });
        } else {
            dispatch({
                type: 'ADD_MENU_ITEM',
                payload: { id: `m-${Date.now()}`, ...formState, price, isAvailable: true }
            });
        }
        resetForm();
    };

    const resetForm = () => {
        setFormState({ name: '', price: '', category: MENU_CATEGORIES[0], image: '' });
        setEditingItem(null);
        setIsFormVisible(false);
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setFormState({
            name: item.name,
            price: String(item.price),
            category: item.category,
            image: item.image
        });
        setIsFormVisible(true);
    };
    
    const handleDelete = (itemId: string) => {
        if(window.confirm('Are you sure you want to delete this item?')) {
            dispatch({ type: 'DELETE_MENU_ITEM', payload: { itemId } });
        }
    };

    const handleToggleAvailability = (itemId: string) => {
        dispatch({ type: 'TOGGLE_MENU_ITEM_AVAILABILITY', payload: { itemId } });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-brand-dark">จัดการเมนูอาหาร</h2>
                <button onClick={() => { setIsFormVisible(!isFormVisible); setEditingItem(null); }} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors">
                    {isFormVisible ? 'ยกเลิก' : 'เพิ่มเมนูใหม่'}
                </button>
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4 border">
                    <h3 className="text-xl font-semibold text-brand-dark">{editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="ชื่อเมนู" className="bg-white p-2 rounded w-full border border-gray-300" required />
                        <input type="number" name="price" value={formState.price} onChange={handleInputChange} placeholder="ราคา" className="bg-white p-2 rounded w-full border border-gray-300" required />
                    </div>
                    <div>
                        <select name="category" value={formState.category} onChange={handleInputChange} className="bg-white p-2 rounded w-full border border-gray-300">
                            {MENU_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">รูปภาพ</label>
                        <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-opacity-80"/>
                        {formState.image && <img src={formState.image} alt="Preview" className="mt-4 h-24 w-24 object-cover rounded-lg" />}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                            ยกเลิก
                        </button>
                        <button type="submit" className="bg-brand-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded">
                            {editingItem ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มเมนู'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map(item => (
                    <div key={item.id} className={`bg-white rounded-lg shadow-md border p-4 flex flex-col relative ${!item.isAvailable ? 'opacity-60' : ''}`}>
                        {!item.isAvailable && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                                สินค้าหมด
                            </div>
                        )}
                        <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md mb-4" />
                        <h4 className="text-lg font-bold text-brand-dark">{item.name}</h4>
                        <p className="text-gray-500">{item.category}</p>
                        <p className="text-brand-primary font-semibold mt-2">{item.price} บาท</p>
                        <div className="mt-auto pt-4 flex gap-2">
                             <button 
                                onClick={() => handleToggleAvailability(item.id)}
                                className={`flex-1 text-white text-sm py-2 px-3 rounded transition-colors ${
                                    item.isAvailable 
                                        ? 'bg-yellow-500 hover:bg-yellow-600' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {item.isAvailable ? 'ของหมด' : 'มีของ'}
                            </button>
                             <button onClick={() => handleEdit(item)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded">แก้ไข</button>
                             <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded">ลบ</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuEditorPage;