import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const TransactionForm = ({ open, handleClose, handleSubmit, initialData }) => {
  const [transactionType, setTransactionType] = React.useState(initialData?.transactionType || '');
  const [category, setCategory] = React.useState(initialData?.category || '');

  // State to track form errors
  const [formErrors, setFormErrors] = React.useState({
    date: false,
    title: false,
    amount: false,
    transactionType: false,
    category: false,
    description: false,
  });

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
    setFormErrors((prev) => ({ ...prev, transactionType: false }));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setFormErrors((prev) => ({ ...prev, category: false }));
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.date) errors.date = "Date is required";
    if (!formData.title) errors.title = "Title is required";
    if (!formData.amount) errors.amount = "Amount is required";
    if (!transactionType) errors.transactionType = "Transaction Type is required";
    if (!category) errors.category = "Category is required";
    if (!formData.description) errors.description = "Description is required";
    return errors;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          formJson.transactionType = transactionType;
          formJson.category = category;

          const errors = validateForm(formJson);
          if (Object.keys(errors).length > 0) {
            setFormErrors(errors);  // Set the errors and re-render
            return;
          }

          handleSubmit(formJson);
        },
      }}
    >
      <DialogTitle>{initialData ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {initialData ? "Edit your transaction details" : "Enter the details for the new transaction."}
        </DialogContentText>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-x-5">
            {/* Date Field */}
            <TextField
              className="flex-1 cursor-pointer"
              autoFocus
              required
              margin="dense"
              id="date"
              name="date"
              label="Date"
              type="date"
              defaultValue={initialData?.date || ""}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={!!formErrors.date}
              helperText={formErrors.date}
            />

            {/* Title Field */}
            <TextField
              className="flex-1"
              required
              margin="dense"
              id="title"
              name="title"
              label="Title"
              defaultValue={initialData?.title || ""}
              variant="outlined"
              error={!!formErrors.title}
              helperText={formErrors.title}
            />
          </div>

          {/* Amount Field */}
          <TextField
            required
            margin="dense"
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            defaultValue={initialData?.amount || ""}
            variant="outlined"
            fullWidth
            error={!!formErrors.amount}
            helperText={formErrors.amount}
          />

          <div className="flex flex-wrap gap-x-5">
            {/* Transaction Type Field */}
            <FormControl required margin="dense" className="flex-1" error={!!formErrors.transactionType}>
              <InputLabel id="transactionType-label">Transaction Type</InputLabel>
              <Select
                labelId="transactionType-label"
                id="transactionType"
                name="transactionType"
                value={transactionType}
                onChange={handleTransactionTypeChange}
                variant="outlined"
              >
                <MenuItem value="Expense">Expense</MenuItem>
                <MenuItem value="Income">Income</MenuItem>
              </Select>
              {formErrors.transactionType && <p style={{ color: "red" }}>{formErrors.transactionType}</p>}
            </FormControl>

            {/* Category Field */}
            <FormControl required margin="dense" className="flex-1" error={!!formErrors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={category}
                onChange={handleCategoryChange}
                variant="outlined"
              >
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
              </Select>
              {formErrors.category && <p style={{ color: "red" }}>{formErrors.category}</p>}
            </FormControl>
          </div>

          {/* Description Field */}
          <TextField
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            defaultValue={initialData?.description || ""}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">{initialData ? "Update" : "Submit"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;
