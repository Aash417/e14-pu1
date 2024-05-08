import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import { Input } from './components/ui/input';

function App() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [excelData, setExcelData] = useState<any[]>([]);
	const [next, setNext] = useState(0);
	const [sub, setSub] = useState('');
	const [con, setCon] = useState('');
	const { sno, name, pan, ay, section } = excelData[next] || {};

	useEffect(() => {
		setSub(
			() =>
				`Penalty proceedings in the case of ${name}, PAN-${pan}, section-${section} for A.Y ${ay} reg.`
		);
		setCon(
			() =>
				`Dear Taxpayer,\nKindly refer to the ongoing penalty proceedings u/s ${section} in your case for A.Y ${ay}\n1. Records show that you have not complied with the Show-Cause Notice issued in your case.\n2. Records of proceedings including notices issued are available in your registered account at e-filing portal (www.incometax.gov.in)\n3. This is to remind that you are required to furnish your reply to	the notice within the due time through your account at e-filing portal(www.incometax.gov.in). You must submit your reply within 5 days of receipt of this communication.\n4. Please appreciate that your reply to notice(s) would enable a fair decision on penalty proceedings taking into account the information and explanation provided.\n5. In case of any technical difficulty in submitting response to the notice through e-filing portal, please contact e-filing helpdesk (details at www.incometax.gov.in) or mail to efilingwebmanger@incometax.gov.in.`
		);
	}, [ay, name, next, pan, section]);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; // Add null check
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (event: ProgressEvent<FileReader>) => {
			const target = event.target;
			if (!target) return;

			const { result } = target;
			if (!result) return;

			const data = new Uint8Array(result as ArrayBuffer);
			const workbook = XLSX.read(data, { type: 'array' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(sheet);

			setExcelData(jsonData);
		};

		reader.readAsArrayBuffer(file);
	};

	if (!excelData.length)
		return (
			<div className='w-1/2 h'>
				<Input
					type='file'
					className='cursor-pointer'
					onChange={handleFileUpload}
					accept='.xlsx, .xls'
				/>
			</div>
		);

	if (excelData)
		return (
			<>
				<div className='pt-12 pb-12 '>
					{excelData && (
						<div className='flex gap-10 font-bold'>
							<span>{sno || ''}</span>
							<span>{name || ''}</span>
							<span>{pan || ''}</span>
							<span>{section || ''}</span>
							<span>{ay || ''}</span>
						</div>
					)}
				</div>

				<div className='flex gap-10'>
					<div className='flex flex-col max-w-2xl gap-6'>
						<div className='flex gap-5 bg-zinc-50'>
							<code className=''>{sub}</code>
							<Button
								variant='outline'
								onClick={async () => {
									await navigator.clipboard.writeText(sub);
								}}
							>
								<Clipboard className='w-5 h-5 ' /> copy
							</Button>
						</div>

						<div className='flex gap-5 bg-zinc-50'>
							<code className=''>{con}</code>
							<Button
								variant='outline'
								onClick={async () => {
									await navigator.clipboard.writeText(con);
								}}
							>
								<Clipboard className='w-5 h-5' />
								copy
							</Button>
						</div>
					</div>

					<div className=''>
						{excelData.length && (
							<div className='flex gap-3'>
								<Button variant='outline' onClick={() => setNext((c) => c + 1)}>
									Next
								</Button>
								<Button variant='outline' onClick={() => setNext((c) => c - 1)}>
									Prev
								</Button>
							</div>
						)}
					</div>
				</div>
			</>
		);
}

export default App;
