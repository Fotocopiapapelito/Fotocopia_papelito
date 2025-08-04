import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Printer, Loader2, Phone, Mail, MapPin, Globe, MessageSquare } from 'lucide-react';

export default function App() {
    const [customerName, setCustomerName] = useState('');
    const [files, setFiles] = useState([]);
    const [isOrderSent, setIsOrderSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            id: `${file.name}-${file.lastModified}-${file.size}`,
            fileObject: file,
            name: file.name,
            options: {
                colorMode: 'bn',
                sides: 'una',
                paperType: '80g', // Default paper type
                copies: 1,
            }
        }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        setIsOrderSent(false);
        setSubmitError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        }
    });

    const handleOptionChange = (id, option, value) => {
        setFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === id ? { ...file, options: { ...file.options, [option]: value } } : file
            )
        );
    };

    const handleRemoveFile = (id) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    };

    const handleWhatsAppOrder = () => {
      if (!customerName.trim()) {
          setSubmitError('Por favor, introduce tu nombre.');
          return;
      }

      let message = `*Nuevo Pedido de ${customerName}*\n\n`;
      files.forEach((file, index) => {
          message += `*Archivo ${index + 1}:* ${file.name}\n`;
          message += `*Opciones:* ${file.options.colorMode === 'bn' ? 'B&N' : 'Color'}, ${file.options.sides === 'una' ? 'Una Cara' : 'Doble Cara'}, Papel ${file.options.paperType}, ${file.options.copies} copias.\n\n`;
      });
      message += "Por favor, adjunta los archivos a este chat. ¡Gracias!";

      const whatsappUrl = `https://wa.me/34612202784?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    const handleSubmitOrder = async () => {
        if (!customerName.trim()) {
            setSubmitError('Por favor, introduce tu nombre.');
            return;
        }

        const YOUR_EMAIL = 'Fotocopiapapelito@gmail.com';
        const FORM_ENDPOINT = `https://formsubmit.co/${YOUR_EMAIL}`;

        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData();

        formData.append('_subject', `Nuevo Pedido de ${customerName}`);
        formData.append('_captcha', 'false');

        let orderSummary = `Pedido para: ${customerName}\n\nDetalles del Pedido:\n\n`;
        files.forEach((file, index) => {
            const optionsSummary = `Archivo #${index + 1}: ${file.name}\nOpciones: ${file.options.colorMode === 'bn' ? 'B&N' : 'Color'}, ${file.options.sides === 'una' ? 'Una Cara' : 'Doble Cara'}, Papel ${file.options.paperType}, ${file.options.copies} copias.\n\n`;
            orderSummary += optionsSummary;
            formData.append(`attachment_${index + 1}`, file.fileObject);
        });

        formData.append('message', orderSummary);

        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setIsOrderSent(true);
                setFiles([]);
                setCustomerName('');
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Hubo un error al enviar tu pedido. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="antialiased bg-gray-50 text-gray-800 font-sans">
            <div className="min-h-screen flex flex-col items-center justify-center p-4">

                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-600">Papelito Fotocopia</h1>
                    <div className="flex justify-center items-center space-x-4 mt-3 text-gray-600">
                        <div className="flex items-center">
                            <Phone size={16} className="mr-2"/>
                            <span>612 202 784</span>
                        </div>
                        <div className="flex items-center">
                            <Mail size={16} className="mr-2"/>
                            <span>Fotocopiapapelito@gmail.com</span>
                        </div>
                    </div>
                </header>

                <main className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                    {isOrderSent ? (
                        <div className="text-center p-8">
                            <h2 className="text-2xl font-semibold text-green-600 mb-4">¡Pedido Enviado!</h2>
                            <p className="text-gray-600 mb-6">Gracias por tu pedido. Puedes recogerlo en nuestra tienda:</p>
                            <div className="bg-gray-100 p-4 rounded-lg my-4 text-left">
                                <p className="font-semibold text-gray-800">Dirección:</p>
                                <p className="text-gray-700">C/La Regente 23, Local Papelito, 29009 Málaga</p>
                                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <a href="https://maps.app.goo.gl/AtQbZmwKQukyEUB59" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors w-full">
                                        <MapPin size={20} className="mr-2"/> Ver en Google Maps
                                    </a>
                                    <a href="https://papelitomalaga.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors w-full">
                                        <Globe size={20} className="mr-2"/> Visita nuestra web
                                    </a>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOrderSent(false)}
                                className="mt-6 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Hacer un Nuevo Pedido
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    id="customerName"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Tu Nombre y Apellido"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center text-gray-500">
                                    <UploadCloud className="w-12 h-12 mb-4" />
                                    {isDragActive ? (
                                        <p className="text-lg font-semibold">Suelta los archivos aquí...</p>
                                    ) : (
                                        <p className="text-lg font-semibold">Arrastra tus archivos o haz clic para seleccionar</p>
                                    )}
                                    <p className="text-sm mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Archivos para Imprimir</h2>
                                    <div className="space-y-4">
                                        {files.map(file => (
                                            <FileItem
                                                key={file.id}
                                                file={file}
                                                onOptionChange={handleOptionChange}
                                                onRemove={handleRemoveFile}
                                            />
                                        ))}
                                    </div>

                                    {submitError && (
                                        <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
                                            {submitError}
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0">
                                        <button
                                            onClick={handleWhatsAppOrder}
                                            disabled={isSubmitting}
                                            className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            <MessageSquare className="w-5 h-5 mr-2" />
                                            Enviar por WhatsApp
                                        </button>
                                        <button
                                            onClick={handleSubmitOrder}
                                            disabled={isSubmitting || files.length === 0}
                                            className="flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            ) : (
                                                <Printer className="w-5 h-5 mr-2" />
                                            )}
                                            {isSubmitting ? 'Enviando...' : 'Enviar Pedido por Email'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
                <footer className="text-center mt-8 text-gray-500">
                    <p className="text-sm">&copy; {new Date().getFullYear()} Papelito Fotocopia. Todos los derechos reservados.</p>
                    <p className="text-xs mt-2">Hecho por Patrick - 628 359 125</p>
                </footer>
            </div>
        </div>
    );
}

function FileItem({ file, onOptionChange, onRemove }) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0 min-w-0">
                    <FileText className="w-8 h-8 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="font-medium truncate" title={file.name}>{file.name}</span>
                </div>

                <button
                    onClick={() => onRemove(file.id)}
                    className="self-start md:self-center text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Quitar archivo"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name={`colorMode-${file.id}`} value="bn" checked={file.options.colorMode === 'bn'} onChange={(e) => onOptionChange(file.id, 'colorMode', e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                            <span className="ml-2 text-sm">B/N</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name={`colorMode-${file.id}`} value="color" checked={file.options.colorMode === 'color'} onChange={(e) => onOptionChange(file.id, 'colorMode', e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                            <span className="ml-2 text-sm">Color</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caras</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name={`sides-${file.id}`} value="una" checked={file.options.sides === 'una'} onChange={(e) => onOptionChange(file.id, 'sides', e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                            <span className="ml-2 text-sm">Una Cara (1-sided)</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name={`sides-${file.id}`} value="dos" checked={file.options.sides === 'dos'} onChange={(e) => onOptionChange(file.id, 'sides', e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                            <span className="ml-2 text-sm">Doble Cara (2-sided)</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor={`paperType-${file.id}`} className="block text-sm font-medium text-gray-700 mb-2">Tipo de Papel</label>
                    <select id={`paperType-${file.id}`} value={file.options.paperType} onChange={(e) => onOptionChange(file.id, 'paperType', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="80g">80 Gramos</option>
                        <option value="160g">160 Gramos</option>
                        <option value="200g">200 Gramos</option>
                        <option value="cartulina">Cartulina</option>
                        <option value="papel de foto">Papel de foto</option>
                        <option value="papel pegatina">Papel pegatina</option>
                        <option value="papel transparente">Papel transparente</option>
                        <option value="A3 90g">A3 90 Gramos</option>
                        <option value="A3 180g">A3 180 Gramos</option>
                    </select>
                </div>

                <div>
                    <label htmlFor={`copies-${file.id}`} className="block text-sm font-medium text-gray-700 mb-2">Copias</label>
                    <input type="number" id={`copies-${file.id}`} min="1" value={file.options.copies} onChange={(e) => onOptionChange(file.id, 'copies', parseInt(e.target.value, 10))} className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
        </div>
    );
}
