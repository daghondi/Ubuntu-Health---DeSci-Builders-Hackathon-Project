import React from 'react';

/**
 * Ubuntu Health - Cultural Philosophy Integration Component
 * "I am because we are" - Community healing interface
 */

interface UbuntuPhilosophyProps {
  showFullPhilosophy?: boolean;
  communityContext?: string;
  elderPresent?: boolean;
}

export const UbuntuPhilosophyComponent: React.FC<UbuntuPhilosophyProps> = ({
  showFullPhilosophy = false,
  communityContext = 'healthcare',
  elderPresent = false
}) => {
  return (
    <div className="ubuntu-philosophy-container">
      <div className="ubuntu-header">
        <h2 className="text-2xl font-bold text-ubuntu-orange">
          🌍 Ubuntu Health Philosophy
        </h2>
        <p className="text-lg text-gray-700 italic">
          "Umuntu ngumuntu ngabantu" - I am because we are
        </p>
      </div>
      
      {showFullPhilosophy && (
        <div className="ubuntu-explanation bg-orange-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Ubuntu in Healthcare</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-ubuntu-orange mr-2">🤝</span>
              <span>Community healing - we heal together as one</span>
            </li>
            <li className="flex items-start">
              <span className="text-ubuntu-orange mr-2">👥</span>
              <span>Collective responsibility for each other's wellbeing</span>
            </li>
            <li className="flex items-start">
              <span className="text-ubuntu-orange mr-2">🌱</span>
              <span>Traditional wisdom guides modern healthcare technology</span>
            </li>
            <li className="flex items-start">
              <span className="text-ubuntu-orange mr-2">💝</span>
              <span>Healthcare access as a community right, not individual privilege</span>
            </li>
          </ul>
        </div>
      )}
      
      {elderPresent && (
        <div className="elder-blessing bg-amber-50 p-4 rounded-lg mt-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">👴🏿</span>
            <div>
              <p className="font-semibold">Elder Council Blessing</p>
              <p className="text-sm text-gray-600">
                This healing journey is witnessed and blessed by our community elders
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="community-context mt-4">
        <p className="text-sm text-gray-600">
          Healthcare decisions made with Ubuntu principles honor our collective wisdom
          and ensure that individual healing strengthens the entire community.
        </p>
      </div>
    </div>
  );
};

export default UbuntuPhilosophyComponent;
