import Product from "@/lib/models/product";
import { connectToDatabase } from "@/lib/services/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { SortOrder } from "mongoose";

export async function GET(request: NextRequest) {

    // // First try to get product from the sample data for development

    // if (sampleBagProducts) {

    //     return NextResponse.json({
    //         products:sampleBagProducts,
    //         pagination: {
    //             total: 4,
    //             page:1,
    //             limit:10,
    //             pages: 1
    //         }
    //     })}
        try {
            await connectToDatabase();            // Get query parameters
            const searchParams = request.nextUrl.searchParams;
            const productType = searchParams.get("productType");
            const sortBy = searchParams.get("sortBy") || "createdAt"; // Default sort by createdAt
            const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1; // Default to descending
            const limit = parseInt(searchParams.get("limit") || "20"); // Default limit
            const page = parseInt(searchParams.get("page") || "1"); // Default page

            // Calculate skip for pagination
            const skip = (page - 1) * limit;            // Create filter object
            interface ProductFilter {
                productType?: string;
            }
            const filter: ProductFilter = {};
            if (productType && productType !== 'all') {
                filter.productType = productType;
            }
            
            // Create sort object
            const sortOptions: { [key: string]: SortOrder } = {};
            sortOptions[sortBy] = sortOrder;

            // Fetch products with pagination, filtering, and sorting
            const products = await Product.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            // Get total count for pagination info (with same filter)
            const totalProducts = await Product.countDocuments(filter);

            return NextResponse.json({
                products,
                pagination: {
                    total: totalProducts,
                    page,
                    limit,
                    pages: Math.ceil(totalProducts / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            return NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            );
        }
    }