import React, { useEffect, useState } from 'react';
import { 
    createTransactionApi, 
    deleteTransactionApi, 
    getAllTransactionByUserIdApi, 
    getTransactionsApi, 
    updateTransactionApi 
} from '../utils/Api';
import { json, Navigate } from 'react-router-dom';
import { Alert, IconButton, Snackbar, Button } from '@mui/material';
import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TransactionForm from '../Transaction-Data/TransactionForm';

import { useNavigate } from 'react-router-dom';



function Transaction() {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionId, settransactionId] = useState("");
    // Dialog control for add/edit form
    const [openDialog, setOpenDialog] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpence, setTotalExpence] = useState(0);

    // Fetch transactions
    const fetchTransactions = async () => {
        if (!currentUser) return;

        try {
            const response = await fetch(getAllTransactionByUserIdApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                }),
            });


            const data = await response.json();
            console.log("transactions", data.transactions)

            let expence = 0;
            let income = 0;

            for (let i = 0; i<data.transactions.length; i++) {
                if (data.transactions[i].transactionType == "Expense") {
                    expence += data.transactions[i].amount;
                }
                else {
                    income += data.transactions[i].amount;
                }
                
            }
            setTotalIncome(income);
            setTotalExpence(expence);
            console.log("total", income - expence)
            if (data.transactions.length === 0) {
                setIsError(true);
                setErrorMessage('No transactions done yet!');
            } else {
                setIsError(false);
                setErrorMessage('');
                setTransactions(data.transactions);
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
                setAlertMessage("Transaction added !");
                await fetchTransactions();
            } else {
                setAlert(false);
                setAlertMessage("");
                console.log(response)
                setIsError(true);
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.message);
        }
    };

    const updateTransaction = async (formData) => {
        try {
            console.log("transaction-id",transactionId)
            console.log("edit-data", formData)
            const apiUrl = `${updateTransactionApi}/${transactionId}`;
            const response = await axios.put(apiUrl, formData);
            console.log(response)
            

            if (response.data.success) {
                setAlert(true);
                setAlertMessage("Transaction updated !");
                await fetchTransactions();
            } else {
                setAlert(false);
                setAlertMessage("");
                setIsError(true);
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.message);
        }
    };

    const deleteTransaction = async (transactionId) => {
        try {
            const apiUrl = `${deleteTransactionApi}/${transactionId}/${currentUser.id}`;

            const response = await axios.delete(apiUrl);
            if (response.data.success) {
                setAlert(true);
                setAlertMessage("Transaction deleted !");
                navigate(0);
                await fetchTransactions();
            } else {
                setAlert(false);
                setAlertMessage("");
                setIsError(true);
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.message);
        }
    };

    // Dialog handlers
    const handleOpenDialog = () => {
        setTransactionToEdit(null);
        setOpenDialog(true);
    };

    const handleEdit = (transaction) => {
        settransactionId(transaction._id);
        setTransactionToEdit(transaction);
        setOpenDialog(true);
    };

    const handleDelete = (transaction) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            deleteTransaction(transaction._id);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFormSubmit = (formData) => {
        if (transactionToEdit) {
            updateTransaction(formData); // Editing existing transaction
        } else {
            addTransaction(formData); // Adding new transaction
        }
        handleCloseDialog();
    };

    // const handleLogout = () => {
    //     localStorage.removeItem('user');
    //     setRedirect(true);
    // };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            setRedirect(true);
        } else {
            const obj = JSON.parse(user);
            setCurrentUser(obj)
            console.log(user);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            // navigate(0);
            fetchTransactions();
        }
    }, [currentUser]);

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='px-20 '>
            <h1 className="text-blue-800 text-3xl font-bold text-center pb-5">Welcome {currentUser?.name}!</h1>

            {/* Add Transaction Button */}
            <div className="flex justify-end pb-5">
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={handleOpenDialog}
                >
                    Add Transaction
                </Button>
            </div>

            {isError && (
                <Snackbar 
                    open={isError} 
                    anchorOrigin={{ vertical:"bottom", horizontal:"left" }} 
                    autoHideDuration={6000} 
                    onClose={() => setIsError(false)}
                >
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                  >
                    {errorMessage}
                  </Alert>
                </Snackbar>
            )} {
                alert && (
                    <Snackbar 
                    open={alert} 
                    anchorOrigin={{ vertical:"top", horizontal:"right" }} 
                    autoHideDuration={6000} 
                    onClose={() => setAlert(false)}
                >
                  <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                  >
                    {alertMessage}
                  </Alert>
                </Snackbar>
                )
            }

            {/* Transaction Form Dialog */}
            {openDialog && (
                <TransactionForm
                    open={openDialog}
                    handleClose={handleCloseDialog}
                    handleSubmit={handleFormSubmit}
                    initialData={transactionToEdit} // If editing, this will pre-populate the form
                />
            )}

            {/* Transaction Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell ><h2 className='text-gray-500 text-xl font-semibold'>Date</h2></TableCell>
                            <TableCell align="center"><h2 className='text-gray-500 text-xl font-semibold'>Title</h2></TableCell>
                            <TableCell align="center"><h2 className='text-gray-500 text-xl font-semibold'>Amount</h2></TableCell>
                            <TableCell align="center"><h2 className='text-gray-500 text-xl font-semibold'>Transaction type</h2></TableCell>
                            <TableCell align="center"><h2 className='text-gray-500 text-xl font-semibold'>Category</h2></TableCell>
                            <TableCell align="center"><h2 className='text-gray-500 text-xl font-semibold'>Edit & Delete</h2></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row">{new Date(row.date).toLocaleDateString()}</TableCell>

                                <TableCell align="center">{row.title}</TableCell>
                                <TableCell align="center">{row.amount}</TableCell>
                                <TableCell align="center">{row.transactionType}</TableCell>
                                <TableCell align="center">{row.category}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleEdit(row)} aria-label="edit">
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(row)} aria-label="delete">
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell  align="center"></TableCell>
                            <TableCell  align="center"></TableCell>
                            <TableCell  align="center"></TableCell>
                            <TableCell  align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="left">
                                <h2 className="text-gray-500 text-xl font-bold">
                                  Analytics:     
                                  <span 
                                    className={`ml-2 + ${
                                      totalIncome - totalExpence > 0 
                                        ? 'text-green-500'  
                                        : totalIncome - totalExpence < 0 
                                        ? 'text-red-500'   
                                        : 'text-gray-500'   
                                    }`}
                                  >
                                    {(totalIncome - totalExpence).toFixed(2)}
                                  </span>
                                </h2>
                            </TableCell>


                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Transaction;
