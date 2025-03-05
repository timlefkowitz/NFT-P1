import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ArtworkCardProps {
    salePrice: string;
    saleDate: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ salePrice, saleDate }) => {
    return (
        <Card sx={{ mt: 4, border: '1px solid #ddd', borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Latest Transaction
                </Typography>
                <Typography variant="body1">Sale Price: {salePrice}</Typography>
                <Typography variant="body1">Date: {saleDate}</Typography>
            </CardContent>
        </Card>
    );
};

export default ArtworkCard;