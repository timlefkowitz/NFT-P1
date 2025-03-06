import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Container, Typography, Box, AppBar, Toolbar, Button, TextField, IconButton } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import SearchIcon from '@mui/icons-material/Search';
import ArtworkCard from './components/ArtworkCard';
import contractABI from './contract/ArtworkNFT.json';

const App: React.FC = () => {
  const contractAddress = '0xYourDeployedContractAddress'; // Replace with your address
  const [currentOwner, setCurrentOwner] = useState('Loading...');
  const [salePrice, setSalePrice] = useState('Loading...');
  const [saleDate, setSaleDate] = useState('Loading...');
  const [chartData, setChartData] = useState<{ dates: string[]; prices: number[] }>({
    dates: [],
    prices: [],
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const loadArtworkData = async (tokenId: number = 1) => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet!');
      setCurrentOwner('No wallet detected');
      setSalePrice('N/A');
      setSaleDate('N/A');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);

      const saleHistory: any[] = await contract.getSaleHistory(tokenId);
      const formattedHistory = saleHistory.map((sale: any) => ({
        price: Number(ethers.formatEther(sale.price)),
        owner: sale.owner,
        date: new Date(Number(sale.date) * 1000).toLocaleDateString(),
      }));

      setChartData({
        dates: formattedHistory.map((sale) => sale.date),
        prices: formattedHistory.map((sale) => sale.price),
      });

      const latestSale = formattedHistory[formattedHistory.length - 1];
      setCurrentOwner(latestSale.owner);
      setSalePrice(`${latestSale.price} ETH`);
      setSaleDate(latestSale.date);
    } catch (error) {
      console.error('Error fetching data:', error);
      setCurrentOwner('Error');
      setSalePrice('N/A');
      setSaleDate('N/A');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  useEffect(() => {
    loadArtworkData(1); // Load data for token ID 1 on mount
  }, []);

  return (
      <>
        {/* Toolbar */}
        <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              NFT Dashboard
            </Typography>
            <Button color="inherit" sx={{ mr: 2 }}>Home</Button>
            <Button color="inherit" sx={{ mr: 2 }}>Collections</Button>
            <Button color="inherit" sx={{ mr: 2 }}>Stats</Button>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search NFTs..."
                sx={{ bgcolor: 'white', borderRadius: 1, mr: 2, width: '200px' }}
                InputProps={{
                  endAdornment: (
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                  ),
                }}
            />
            <Button
                variant="contained"
                color="secondary"
                onClick={connectWallet}
            >
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Artwork #1
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary">
            Current Owner: {currentOwner}
          </Typography>

          <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Sale History
            </Typography>
            <LineChart
                xAxis={[{ data: chartData.dates, label: 'Date' }]}
                series={[{ data: chartData.prices, label: 'Price (ETH)', color: '#1976d2' }]}
                height={300}
                margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
            />
          </Box>

          <ArtworkCard salePrice={salePrice} saleDate={saleDate} />
        </Container>
      </>
  );
};

export default App;