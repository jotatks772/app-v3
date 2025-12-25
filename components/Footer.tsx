
import React from 'react';

interface FooterProps {
    onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
    
    const LinkColumn: React.FC<{title: string, links: string[]}> = ({ title, links }) => (
        <div>
            <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
            <ul className="space-y-2">
                {links.map(link => <li key={link}><a href="#" className="text-gray-600 hover:text-teal-600 text-sm">{link}</a></li>)}
            </ul>
        </div>
    );
    
    return (
        <footer className="bg-white border-t mt-12">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {/* Manually render the first column to attach the admin click handler */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Produtos e serviços</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-teal-600 text-sm">Proteção contra cancelamentos</a></li>
                            <li>
                                <button onClick={onAdminClick} className="text-gray-600 hover:text-teal-600 text-sm text-left w-full cursor-pointer">
                                    Seguro de viagem
                                </button>
                            </li>
                            <li><a href="#" className="text-gray-600 hover:text-teal-600 text-sm">Seguro de bagagem</a></li>
                        </ul>
                    </div>

                    <LinkColumn title="Quem somos" links={["Quem somos", "Condições de viagem", "Política de privacidade", "Informações sobre cookies", "Declaração de Acessibilidade"]} />
                    <LinkColumn title="Assistência" links={["Contacta-nos", "Perguntas frequentes", "Termos & condições da compania aérea", "As minhas reservas"]} />
                    
                    <div className="col-span-2 lg:col-span-2">
                         <h3 className="font-bold text-gray-800 mb-4">Iniciar sessão</h3>
                         <div className="space-y-3">
                            <button className="w-full max-w-xs border border-gray-300 font-semibold py-2 rounded-full hover:bg-gray-50 text-sm">As minhas reservas</button>
                            <p className="text-sm text-gray-500">Descarregue a aplicação</p>
                            <div className="flex gap-3">
                                <a href="#"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-10" /></a>
                                <a href="#"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/pt-br_badge_web_generic.png" alt="Get it on Google Play" className="h-10" /></a>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8">
                     <div className="flex justify-center gap-4 mb-8">
                        {['visa', 'mastercard', 'amex', 'paypal', 'googlepay'].map(brand => (
                            <img key={brand} src={`https://img.icons8.com/color/48/000000/${brand}.png`} alt={brand} className="h-6" />
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} <span className="font-semibold">Mytrip</span> / OY SRG Finland Ab. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
