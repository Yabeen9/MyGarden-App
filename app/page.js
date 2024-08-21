'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material"
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from "firebase/firestore"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
      })
      setInventory(inventoryList)
      setFilteredInventory(inventoryList)
    } catch (error) {
      console.error("Error fetching inventory: ", error)
    }
  }

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    } catch (error) {
      console.error("Error adding item: ", error)
    }
  }

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
        }
      }
      await updateInventory()
    } catch (error) {
      console.error("Error removing item: ", error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)
    if (query) {
      const filtered = inventory.filter(({ name }) =>
        name.toLowerCase().includes(query)
      )
      setFilteredInventory(filtered)
    } else {
      setFilteredInventory(inventory)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={1}
      sx={{
        backgroundImage: `assets(Bckgrdpic.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={1}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{ bgcolor: '#a3c2a8', color: '#333' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ bgcolor: '#a3c2a8', color: '#333' }}
      >
        Add New Item
      </Button>
      <TextField
        id="search-field"
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 1, width: '400px' }}
      />
      <Box border={'6px solid #333'} width="90vw" bgcolor={'#e6f2e6'} >
        <Box
          height="100px"
          bgcolor={'#a3c2a8'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >   
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" height="75vh" spacing={0} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="120px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f5f5dc'}
              paddingX={2}
            >
              <Typography variant={'h4'} color={'#333'} flex={2} sx={{ textAlign: 'left', marginLeft: '0px' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Stack direction="row" spacing={5} alignItems="center" justifyContent="center" 
               sx={{ textAlign: 'center', width: '100%' }}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{ bgcolor: '#a3c2a8', color: '#333', minWidth: '100px', paddingX: 0.5 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{ bgcolor: '#a3c2a8', color: '#333', minWidth: '100px', paddingX: 0.5 }}
                >
                  Remove
                </Button>
              </Stack>
              <Typography variant={'h4'} color={'#333'} sx={{ textAlign: 'right', marginRight: '80px' }}>
                {quantity}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
