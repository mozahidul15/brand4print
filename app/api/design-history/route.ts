/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/services/mongodb';
import crypto from 'crypto';
import Order from '@/lib/models/Order';

export async function POST(req: NextRequest) {
    try {
        const { artworkData } = await req.json();

        if (!artworkData) {
            return NextResponse.json(
                { error: 'Artwork data is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Generate hash for the artwork
        const artworkString = JSON.stringify(artworkData);
        const artworkHash = crypto.createHash('sha256').update(artworkString).digest('hex');

        // Check if this design has been printed before
        const existingDesign = await Order.findOne({
            'items': { 
            $elemMatch: { 
                'options.designHash': artworkHash 
            } 
            },
            status: { $in: ['shipped', 'delivered'] },
            paymentStatus: 'paid'
        });

        const hasBeenPrinted = !!existingDesign;
        const isFirstTimePrinting = !hasBeenPrinted;
        const printHistory: any[] = [];

        if (hasBeenPrinted && existingDesign) {
            printHistory.push(...(existingDesign.printHistory || []));
        }

        return NextResponse.json({
            hasBeenPrinted,
            isFirstTimePrinting,
            designHash: artworkHash,
            printHistory,
            firstPrintedAt: existingDesign?.printHistory?.[0]?.printedAt,
            totalPrints: printHistory.reduce((sum, print) => sum + print.quantity, 0)
        });

    } catch (error) {
        console.error('Error checking design history:', error);
        return NextResponse.json(
            { error: 'Failed to check design history' },
            { status: 500 }
        );
    }
}