
import React from 'react';
import { SearchCriteria } from '../types';
import SearchForm from './SearchForm';

interface SearchPageProps {
  onSearch: (criteria: SearchCriteria) => void;
}

const FeatureCard: React.FC<{title: string, children: React.ReactNode, linkText: string}> = ({title, children, linkText}) => (
    <div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{children}</p>
        <a href="#" className="text-teal-600 font-semibold text-sm hover:underline">
            {linkText} &rarr;
        </a>
    </div>
);

const SearchPage: React.FC<SearchPageProps> = ({ onSearch }) => {
  return (
    <div>
        {/* Hero Section */}
        <div className="hero-bg text-white">
            <div className="bg-black bg-opacity-40 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Poupe até 60% no seu voo</h1>
                    <p className="text-lg md:text-xl mb-8">Barato para qualquer destino</p>
                    <div className="max-w-4xl mx-auto">
                        <SearchForm onSearch={onSearch} />
                    </div>
                </div>
            </div>
        </div>

        {/* Features Section */}
        <div className="bg-white">
             <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* FIX: Added missing linkText prop */}
                    <FeatureCard title="Superflexível" linkText="Saber mais">
                        Mudança de planos? Com os nossos serviços, pode alterar a data da sua reserva ou optar pelo nosso bilhete flexível, Garantia de cancelamento e muito mais!
                    </FeatureCard>
                     {/* FIX: Added missing linkText prop */}
                     <FeatureCard title="Mantenha-se informado" linkText="Verificar a sua reserva">
                        Precisa de mais informações sobre o seu voo? Inicie sessão em As minhas reservas para obter informações da companhia aérea sobre o seu voo.
                    </FeatureCard>
                     {/* FIX: Added missing linkText prop */}
                     <FeatureCard title="Poupe ao máximo e planeie facilmente" linkText="Encontrar ofertas">
                        Pronto para explorar mais e gastar menos? Com a Mytrip pode encontrar voos, hotéis e aluguer de automóvel.
                    </FeatureCard>
                </div>
            </div>
        </div>

        {/* SEO Content Section */}
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
                <div>
                    <h2 className="text-2xl font-bold mb-3">Encontre as melhores ofertas de voos com a Mytrip</h2>
                    <p className="text-sm leading-relaxed">
                        Encontre e reserve voos baratos em segundos com a Mytrip, comparando preços de mais de 650 companhias aéreas para garantir as melhores tarifas. Aproveite descontos exclusivos, opções de bilhetes flexíveis e apoio ao cliente 24/7.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-3">Como encontrar voos baratos</h2>
                    <p className="text-sm leading-relaxed">
                        Encontrar voos baratos não tem de ser difícil. Com alguma flexibilidade e planeamento, pode poupar bastante nas suas viagens. Seja para uma escapadinha de última hora ou uma viagem planeada com antecedência, estas dicas vão ajudá-lo a encontrar os preços mais baixos na Mytrip.
                    </p>
                     <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                        <li><span className="font-semibold">Reserve com antecedência</span> – Os preços dos voos tendem a ser mais baixos quando reserva com tempo.</li>
                        <li><span className="font-semibold">Seja flexível com as datas</span> – Ajustar as datas de partida ou regresso pode ajudar a encontrar melhores preços.</li>
                        <li><span className="font-semibold">Use aeroportos alternativos</span> – Voar de ou para aeroportos próximos pode representar uma poupança significativa.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SearchPage;
