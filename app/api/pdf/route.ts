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
        // Use the production environment settings
        const executablePath = await chromium.executablePath();
        const browser: Browser | BrowserCore = await puppeteerCore.launch({
            executablePath,
            args: chromium.args,
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
            env: {
                ...process.env,
                // This env variable might disable the built-in PDF viewer
                PUPPETEER_DISABLE_BUILTIN_PDF_VIEWER: 'true'
            }
        });

        const page = await browser.newPage();

        // Optionally, set download behavior (useful if you plan to handle file downloads via CDP)
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: '/tmp' // Adjust path if needed
        });

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

        console.log('Generated PDF size:', pdf.length);

        await browser.close();

        return new NextResponse(pdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=resume.pdf',
            },
        });
    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json({ message: 'Error generating PDF' }, { status: 500 });
    }
}
