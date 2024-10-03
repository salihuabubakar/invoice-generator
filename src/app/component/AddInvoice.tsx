import React, { useState, useEffect, FC, FormEvent, Dispatch, SetStateAction } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { createDocument, updateDocument } from '@/lib/slices/documentsSlice';
import { closeModal } from '@/lib/slices/modalSlice';
import { toast } from 'react-toastify';
import { dateFormatter, generateShortId } from '@/utils/data_types';


export const FormStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #0b5688',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
  maxWidth: "700px",
  width: "95%",
  borderRadius: "8px",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#e4e4e4", // Default scrollbar track color
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "8px",
    backgroundImage: 'linear-gradient(90deg, #233e52, #2a77ad)',
    boxShadow: 'inset 2px 2px 5px 0 rgba(#fff, 0.5)'
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#2a77ad",
  },
};

// Define a type for form data
interface FormData {
  customer_id: string;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  date: string;
  valid_until: string;
  quote: string;
  description_of_work: string;
  items_description: string[];
  items_quantity: number[];
  items_unit: number[];
  items_amount: number[];
}

interface AddInvoiceProps {
  existingData?: any;
  docId: string;
  dispatch: any;
  docIndex: number | string;
  documents: any;
}

const AddInvoice: FC<AddInvoiceProps> = ({ existingData, docId, docIndex, dispatch, documents }) => {

  const isModalOpen = useAppSelector((state) => state.modal.open);

  const [open, setOpen] = useState(isModalOpen);
  const [name, setName] = useState(existingData?.[docIndex]?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(existingData?.[docIndex]?.phone_number || '');
  const [email, setEmail] = useState(existingData?.[docIndex]?.email || '');
  const [address, setAddress] = useState(existingData?.[docIndex]?.address || '');
  const [date, setDate] = useState(existingData?.[docIndex]?.date || '');
  const [validUntil, setValidUntil] = useState(existingData?.[docIndex]?.valid_until || '');
  const [quote, setQuote] = useState(existingData?.[docIndex]?.quote || '');
  const [descOfWork, setDescOfWork] = useState(existingData?.[docIndex]?.description_of_work || '');
  const [itemsDesc, setItemsDesc] = useState(existingData?.[docIndex]?.items_description || ['']);
  const [itemsQuantity, setItemsQuantity] = useState(existingData?.[docIndex]?.items_quantity || []);
  const [itemsUnit, setItemsUnit] = useState(existingData?.[docIndex]?.items_unit || []);
  const [itemsAmount, setItemsAmount] = useState<number[]>([]);

  useEffect(() => {
    // Calculate itemsAmount whenever itemsQuantity or itemsUnit changes
    const calculateItemsAmount = itemsQuantity.map((quantity: number, index: number) => quantity * itemsUnit[index]);
    setItemsAmount(calculateItemsAmount);
  }, [itemsQuantity, itemsUnit]);

  const generatedCustomerId = `mk-${generateShortId()}-el`;

  const handleClose = () => {
    setName('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setDate('');
    setValidUntil('');
    setQuote('');
    setDescOfWork('');
    setItemsDesc(['']);
    setItemsQuantity([]);
    setItemsUnit([]);
    setItemsAmount([]);
    setOpen(dispatch(closeModal()));
  }

  const prevDate = existingData?.[docIndex]?.date;
  const prevValidUntilDate = existingData?.[docIndex]?.valid_until;

  const handleAddField = (setField: Dispatch<SetStateAction<string[]>>, field: string[]) => {
    setField([...field, '']);
  };

  const handleRemoveField = <T extends string | number>(
    index: number, 
    setField: Dispatch<SetStateAction<T[]>>, 
    field: T[]
  ) => {
    const updatedField = [...field];
    updatedField.splice(index, 1);
    setField(updatedField);
  };


  const handleChangeField = <T extends string | number>(
    index: number,
    value: T,
    setField: Dispatch<SetStateAction<T[]>>,
    field: T[]
  ) => {
    const updatedField = [...field];
    updatedField[index] = value;
    setField(updatedField);
  };
  

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const existingCustomerIdOnEdit = existingData?.[docIndex]?.customer_id;
    const existingCustomerEmail = documents?.find((doc: any) => doc.email === email);
    const existingCustomerId = existingCustomerEmail?.customer_id;

    // Check for empty fields
    if (
      !name ||
      !phoneNumber ||
      !email ||
      !address ||
      !date ||
      !validUntil ||
      !quote ||
      !descOfWork ||
      itemsDesc.some((item: string) => !item) ||
      itemsQuantity.some((item: number | any) => !item) ||
      itemsUnit.some((item: number | any) => !item)
    ) {
      alert('Please fill out all required fields.');
      return;
    }

    
    const formData: FormData = {
      customer_id: ((docId ? existingCustomerIdOnEdit : (existingCustomerEmail?.email ? existingCustomerId : generatedCustomerId))),
      name,
      phone_number: phoneNumber,
      email,
      address,
      date,
      valid_until: validUntil,
      quote,
      description_of_work: descOfWork,
      items_description: itemsDesc,
      items_quantity: itemsQuantity,
      items_unit: itemsUnit,
      items_amount: itemsAmount
    };

    if(docId) {
      dispatch(updateDocument({documentId: docId, documentData: formData}))
      toast.success("Invoice updated");
    }else {
      dispatch(createDocument(formData));
      toast.success("Invoice Added");
    }

    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={FormStyle}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div className='flex justify-end'>
              <button
                onClick={handleClose}
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-[#FE4066] shadow-md hover:bg-[#f75878] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                X
              </button>
            </div>
            <Typography className='text-center' id="transition-modal-title" variant="h6" component="h2">
              {docId ? 'Edit' : 'Add'} Invoice
            </Typography>
            <div className='row'>
              <TextField
                required
                placeholder='Name'
                size='small'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-sm-6"
              />
              <TextField
                required
                placeholder="Phone Number"
                size='small'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-sm-6"
              />
              <TextField
                required
                placeholder="Email"
                size='small'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-sm-6"
              />
              <TextField
                required
                placeholder="Address"
                size='small'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-sm-6"
              />
              <TextField
                required
                label={`${docId ? `Prev-Date: ${dateFormatter(prevDate)}` : 'Date'}`}
                size='small'
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-sm-6"
              />
              <TextField
                required
                label={`${docId ? `Prev-Valid Until: ${dateFormatter(prevValidUntilDate)}` : 'Valid Until'}`}
                size='small'
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="col-sm-6"
              />
              <TextField
                required
                placeholder="Quote"
                size='small'
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="col-sm-6"
              />
              <TextField
                required
                placeholder="Desc of Work"
                size='small'
                multiline
                maxRows={4}
                value={descOfWork}
                onChange={(e) => setDescOfWork(e.target.value)}
                className="col-sm-6"
              />
              {itemsDesc.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <TextField
                    required
                    placeholder="Item"
                    size='small'
                    multiline
                    maxRows={4}
                    value={itemsDesc[index] || ''}
                    onChange={(e) => handleChangeField(index, e.target.value, setItemsDesc, itemsDesc)}
                    className="col-sm-6"
                  />
                  <TextField
                    required
                    placeholder="Item Quantity"
                    type="number"
                    size='small'
                    value={itemsQuantity[index] || ''}
                    onChange={(e) => handleChangeField(index, Number(e.target.value), setItemsQuantity, itemsQuantity)}
                    className="col-sm-6"
                  />
                  <TextField
                    required
                    placeholder="Item Unit Price"
                    type="number"
                    size='small'
                    value={itemsUnit[index] || ''}
                    onChange={(e) => handleChangeField(index, e.target.value, setItemsUnit, itemsUnit)}
                    className="col-sm-6"
                  />
                  
                  {index > 0 && (
                    <>
                      { docId ? null : <Button onClick={() => handleRemoveField(index, setItemsDesc, itemsDesc)}>Remove Item</Button>}
                    </>
                  )}
                </React.Fragment>
              ))}
              <Button onClick={() => handleAddField(setItemsDesc, itemsDesc)}>Add Item</Button>
            </div>
            <div className='flex justify-center'>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                {docId ? 'Update' : 'Save'}
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AddInvoice;
