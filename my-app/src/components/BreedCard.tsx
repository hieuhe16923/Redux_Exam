import React from 'react';

interface BreedAttributes {
  name: string;
  description?: string;
  hypoallergenic?: boolean;
  life?: { min: number; max: number };
  female_weight?: { min: number; max: number };
}

interface BreedCardProps {
  id: string;
  attributes: BreedAttributes;
}

const BreedCard: React.FC<BreedCardProps> = ({ id, attributes }) => {
  return (
    <div className="col" key={id}>
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{attributes.name}</h5>
          <p className="card-text">
            <strong>Description:</strong> {attributes.description || 'No description available.'}<br />
            <strong>Lifespan:</strong> {attributes.life?.min ?? '-'} - {attributes.life?.max ?? '-'} years<br />
            <strong>Female Weight:</strong> {attributes.female_weight?.min ?? '-'} - {attributes.female_weight?.max ?? '-'} kg<br />
            <strong>Hypoallergenic:</strong> {attributes.hypoallergenic ? '✅ Yes' : '❌ No'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreedCard;
