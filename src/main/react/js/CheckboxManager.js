import { useState } from 'react';


function useCheckboxManager() {
    const [allCheck, setAllCheck] = useState(false);
    const [checkItem, setCheckItem] = useState({});
    const [showDelete, setShowDelete] = useState(false);

    const handleMasterCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setAllCheck(isChecked);

        const newCheckItem = {};
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const id = checkbox.parentElement.parentElement.children[1].textContent;
            newCheckItem[id] = isChecked;
        });
        setCheckItem(newCheckItem);
        setShowDelete(isChecked);
    };

    const handleCheckboxChange = (e) => {
        const id = e.target.parentElement.parentElement.children[1].textContent;
        const isChecked = e.target.checked;

        setCheckItem(prev => ({
            ...prev,
            [id]: isChecked
        }));

        // Check if any items are selected to show the delete button
        const hasCheckedItems = Object.values({
            ...checkItem,
            [id]: isChecked
        }).some(checked => checked);

        setShowDelete(hasCheckedItems);

        // Uncheck master checkbox if not all are checked
        if (!isChecked) {
            setAllCheck(false);
        }
    };

    const handleDelete = () => {
        const itemsToDelete = Object.keys(checkItem).filter(id => checkItem[id]);
        console.log("Selected items to delete:", itemsToDelete);
        // Add your delete logic here, e.g., axios.post('/delete', { ids: itemsToDelete })
    };

    return {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    };
}

export default useCheckboxManager;
