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
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';

const ResponsiveDialogContent = styled(DialogContent)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ResponsiveFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'calc(50% - 16px)', // Half-width with spacing
    marginRight: theme.spacing(2),
  },
}));

const TransactionForm = ({ open, handleClose, handleSubmit, initialData }) => {
  const [transactionType, setTransactionType] = React.useState(initialData?.transactionType || '');
  const [category, setCategory] = React.useState(initialData?.category || '');

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
      fullWidth
      maxWidth="md"
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
            setFormErrors(errors);
            return;
          }

          handleSubmit(formJson);
        },
      }}
    >
      <DialogTitle>{initialData ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
      <ResponsiveDialogContent>
        <DialogContentText>
          {initialData ? "Edit your transaction details" : "Enter the details for the new transaction."}
        </DialogContentText>

        <Grid container spacing={2}>
          {/* Date Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
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
          </Grid>

          {/* Title Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
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
          </Grid>

          {/* Amount Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              defaultValue={initialData?.amount || ""}
              variant="outlined"
              error={!!formErrors.amount}
              helperText={formErrors.amount}
            />
          </Grid>

          {/* Transaction Type */}
          <Grid item xs={12} sm={6}>
            <ResponsiveFormControl error={!!formErrors.transactionType}>
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
            </ResponsiveFormControl>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <ResponsiveFormControl error={!!formErrors.category}>
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
            </ResponsiveFormControl>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              defaultValue={initialData?.description || ""}
              variant="outlined"
              multiline
              rows={4}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
          </Grid>
        </Grid>
      </ResponsiveDialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">{initialData ? "Update" : "Submit"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;
