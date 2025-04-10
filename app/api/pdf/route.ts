import { NextResponse, type NextRequest } from "next/server";
import { type Browser } from 'puppeteer';
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data');
    const template = searchParams.get('template');

    if (!data || !template) {
        return NextResponse.json({ message: 'Missing data or template' }, { status: 400 });
    }

    try {
        // // THE CORE LOGIC
        // let browser: Browser | BrowserCore;
        // if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
            const executablePath = await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar')
            const browser: Browser | BrowserCore = await puppeteerCore.launch({
                executablePath,
                args: chromium.args,
                headless: chromium.headless,
                defaultViewport: chromium.defaultViewport
            });
        // } else {
        //     browser = await puppeteer.launch({
        //         headless: true,
        //         args: ['--no-sandbox', '--disable-setuid-sandbox']
        //     });
        // }

        const page = await browser.newPage();
        const url = `${process.env.BASE_URL}/resume/download?data=${encodeURIComponent(data)}&template=${template}`;
        
        await page.goto(url, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '10px',
                bottom: '20px',
                left: '10px'
            }
        });

        await browser.close();

        return new NextResponse(pdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=resume.pdf`,
            },
        });
    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json(
            { message: 'Error generating PDF' },
            { status: 500 }
        );
    }
}
