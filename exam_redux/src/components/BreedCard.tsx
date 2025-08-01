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
  groupName?: string;
}

const BreedCard: React.FC<BreedCardProps> = ({ id, attributes, groupName }) => {
  return (
    <div className="card h-100 shadow-sm border-primary">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-primary">{attributes.name}</h5>
        <p className="card-text flex-grow-1">
          <strong>Description:</strong> {attributes.description || 'No description available.'}<br />
          <strong>Lifespan:</strong> {attributes.life?.min ?? '-'} - {attributes.life?.max ?? '-'} years<br />
          <strong>Female Weight:</strong> {attributes.female_weight?.min ?? '-'} - {attributes.female_weight?.max ?? '-'} kg<br />
          <strong>Hypoallergenic:</strong> {attributes.hypoallergenic ? '✅ Yes' : '❌ No'}<br />
          <strong>Group:</strong> {groupName || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default BreedCard;
