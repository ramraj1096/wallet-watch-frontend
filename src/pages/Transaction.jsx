import React, { useEffect, useState } from 'react';
import { 
    createTransactionApi, 
    deleteTransactionApi, 
    getAllTransactionByUserIdApi, 
    updateTransactionApi 
} from '../utils/Api';
import { Navigate } from 'react-router-dom';
import { Snackbar, Alert, Button, IconButton } from '@mui/material';
import axios from 'axios';
import TransactionForm from '../Transaction-Data/TransactionForm';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    const fetchTransactions = async () => {
        if (!currentUser) return;

        try {
            const response = await fetch(getAllTransactionByUserIdApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id }),
            });
            const data = await response.json();

            if (data.transactions.length === 0) {
                setIsError(true);
                setErrorMessage('No transactions done yet!');
            } else {
                setIsError(false);
                setErrorMessage('');
                setTransactions(data.transactions);

                let expense = 0;
                let income = 0;
                data.transactions.forEach((transaction) => {
                    if (transaction.transactionType === 'Expense') {
                        expense += transaction.amount;
                    } else {
                        income += transaction.amount;
                    }
                });
                setTotalIncome(income);
                setTotalExpense(expense);
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.message);
        }
    };

    const addTransaction = async (formData) => {
        try {
            const response = await axios.post(createTransactionApi, {
                ...formData,
                userId: currentUser.id,
            });
            if (response.data.success) {
                setAlert(true);
                setAlertMessage('Transaction added!');
                await fetchTransactions();
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.message);
        }
    };

    const updateTransaction = async (formData) => {
        try {
            const apiUrl = `${updateTransactionApi}/${transactionId}`;
            const response = await axios.put(apiUrl, formData);
            if (response.data.success) {
                setAlert(true);
                setAlertMessage('Transaction updated!');
                await fetchTransactions();
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.message);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const apiUrl = `${deleteTransactionApi}/${id}/${currentUser.id}`;
            const response = await axios.delete(apiUrl);
            if (response.data.success) {
                setAlert(true);
                setAlertMessage('Transaction deleted!');
                await fetchTransactions();
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.message);
        }
    };

    const handleOpenDialog = () => {
        setTransactionToEdit(null);
        setOpenDialog(true);
    };

    const handleEdit = (transaction) => {
        setTransactionId(transaction._id);
        setTransactionToEdit(transaction);
        setOpenDialog(true);
    };

    const handleDelete = (transaction) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(transaction._id);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFormSubmit = (formData) => {
        if (transactionToEdit) {
            updateTransaction(formData);
        } else {
            addTransaction(formData);
        }
        handleCloseDialog();
    };

    useEffect(() => {
        const user = localStorage.getItem('user_walletwatch');
        console.log(user)
        
        if (!user) {
            setRedirect(true);
        } else {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
        }
    }, [currentUser]);

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center text-blue-800">
                Welcome, {currentUser?.name}!
            </h1>

            {/* Add Transaction Button */}
            <div className="flex justify-end mt-6">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    className="bg-blue-600 hover:bg-blue-800"
                >
                    Add Transaction
                </Button>
            </div>

            {/* Error & Success Alerts */}
            {isError && (
                <Snackbar
                    open={isError}
                    autoHideDuration={6000}
                    onClose={() => setIsError(false)}
                >
                    <Alert severity="error" variant="filled">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
            {alert && (
                <Snackbar
                    open={alert}
                    autoHideDuration={6000}
                    onClose={() => setAlert(false)}
                >
                    <Alert severity="success" variant="filled">
                        {alertMessage}
                    </Alert>
                </Snackbar>
            )}

            {/* Transaction Form Dialog */}
            {openDialog && (
                <TransactionForm
                    open={openDialog}
                    handleClose={handleCloseDialog}
                    handleSubmit={handleFormSubmit}
                    initialData={transactionToEdit}
                />
            )}

            {/* Transaction Table */}
            <div className="overflow-x-auto mt-6">
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Title</th>
                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                            <th className="border border-gray-300 px-4 py-2">Type</th>
                            <th className="border border-gray-300 px-4 py-2">Category</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {transaction.title}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {transaction.amount}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {transaction.transactionType}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {transaction.category}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <IconButton
                                        onClick={() => handleEdit(transaction)}
                                        aria-label="edit"
                                        size="small"
                                    >
                                        <EditIcon className="text-blue-600" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(transaction)}
                                        aria-label="delete"
                                        size="small"
                                    >
                                        <DeleteIcon className="text-red-600" />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Total Analytics */}
            <div className="mt-4 text-right">
                <h2 className="text-lg font-semibold">
                    Analytics:{" "}
                    <span
                        className={
                            totalIncome - totalExpense > 0
                                ? "text-green-600"
                                : totalIncome - totalExpense < 0
                                ? "text-red-600"
                                : "text-gray-600"
                        }
                    >
                        {(totalIncome - totalExpense).toFixed(2)}
                    </span>
                </h2>
            </div>
        </div>
    );
}

export default Transaction;
