import React from 'react';
import ScenarioCard from '../components/ScenarioCard';
import scenarios from '../data/scenarios';

const ScenariosSection: React.FC = () => {
  return (
    <section id="scenarios" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Training <span className="text-orange-500">Scenarios</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Practice in realistic environments specifically designed for various industries and applications, from agriculture to urban operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-2">Need access to all scenarios?</p>
          <p className="text-lg font-semibold text-orange-500">Get all scenarios for just ₹1,999</p>
        </div>
      </div>
    </section>
  );
};

export default ScenariosSection;