// Ubuntu Health - DeSci Advanced Medical Treatment Demo
// Interactive demo simulation for DeSci Builders hackathon presentation

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Globe, 
  Shield, 
  Coins, 
  Activity,
  CheckCircle,
  Clock,
  Star,
  Microscope,
  Dna
} from 'lucide-react';

// Demo Data Types
interface DemoPatient {
  id: string;
  name: string;
  age: number;
  location: string;
  condition: string;
  treatment: string;
  facility: string;
  journeyStage: string;
  progress: number;
  sponsorshipGoal: number;
  sponsorshipRaised: number;
  milestones: DemoMilestone[];
}

interface DemoSponsor {
  id: string;
  name: string;
  location: string;
  sponsorshipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalContributed: number;
  patientsSponsored: number;
  interest: string;
  avatar: string;
}

interface DemoMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  fundsReleased: number;
  verificationMethod: string;
  medicalProvider: string;
}

interface DemoNetworkStats {
  totalPatients: number;
  totalSponsors: number;
  totalHealers: number;
  fundsRaised: number;
  successfulJourneys: number;
  countriesActive: number;
  traditionalKnowledgeContributions: number;
}

// Demo Data
const demoPatient: DemoPatient = {
  id: 'patient-sarah',
  name: 'Sarah Chen',
  age: 34,
  location: 'Austin, Texas',
  condition: 'Stage 2 Breast Cancer',
  treatment: 'CAR-T Cell Therapy',
  facility: 'Swiss Cancer Research Institute',
  journeyStage: 'CAR-T Infusion Phase',
  progress: 75,
  sponsorshipGoal: 400000,
  sponsorshipRaised: 400000,
  milestones: [
    {
      id: 'milestone-1',
      title: 'Initial Consultation & Testing',
      description: 'Comprehensive medical evaluation and CAR-T eligibility confirmation',
      completed: true,
      fundsReleased: 25000,
      verificationMethod: 'Medical records + genetic testing results',
      medicalProvider: 'Swiss Cancer Research Institute'
    },
    {
      id: 'milestone-2',
      title: 'T-Cell Extraction',
      description: 'Patient T-cells collected for genetic modification',
      completed: true,
      fundsReleased: 75000,
      verificationMethod: 'Laboratory confirmation + cell count verification',
      medicalProvider: 'Swiss Cancer Research Institute'
    },
    {
      id: 'milestone-3',
      title: 'CAR-T Manufacturing',
      description: 'T-cells genetically modified to target cancer cells',
      completed: true,
      fundsReleased: 150000,
      verificationMethod: 'Manufacturing completion certificate + quality assurance',
      medicalProvider: 'Swiss Cancer Research Institute'
    },
    {
      id: 'milestone-4',
      title: 'CAR-T Infusion',
      description: 'Modified T-cells infused back into patient',
      completed: false,
      fundsReleased: 0,
      verificationMethod: 'Infusion procedure documentation + monitoring data',
      medicalProvider: 'Swiss Cancer Research Institute'
    },
    {
      id: 'milestone-5',
      title: 'Recovery Monitoring',
      description: '30-day post-treatment monitoring and assessment',
      completed: false,
      fundsReleased: 0,
      verificationMethod: 'Medical scans + blood work + oncologist assessment',
      medicalProvider: 'Swiss Cancer Research Institute'
    },
    {
      id: 'milestone-6',
      title: 'Outcome Verification',
      description: '6-month follow-up with treatment efficacy confirmation',
      completed: false,
      fundsReleased: 0,
      verificationMethod: 'Final medical report + tumor response evaluation',
      medicalProvider: 'Swiss Cancer Research Institute'
    }
  ]
};

const demoSponsors: DemoSponsor[] = [
  {
    id: 'sponsor-alex',
    name: 'Alex Kozlov',
    location: 'San Francisco, CA',
    sponsorshipLevel: 'Platinum',
    totalContributed: 150000,
    patientsSponsored: 8,
    interest: 'Longevity Research & Cancer Immunotherapy',
    avatar: '�‍💼'
  },
  {
    id: 'sponsor-maria',
    name: 'Dr. Maria Santos',
    location: 'Barcelona, Spain',
    sponsorshipLevel: 'Gold',
    totalContributed: 100000,
    patientsSponsored: 5,
    interest: 'CAR-T Therapy Research Data Access',
    avatar: '�‍⚕️'
  },
  {
    id: 'sponsor-dao',
    name: 'Crypto Health DAO',
    location: 'Global',
    sponsorshipLevel: 'Platinum',
    totalContributed: 150000,
    patientsSponsored: 12,
    interest: 'Decentralized Healthcare Mission Alignment',
    avatar: '�️'
  }
];

const initialNetworkStats: DemoNetworkStats = {
  totalPatients: 2847,
  totalSponsors: 1205,
  totalHealers: 89,
  fundsRaised: 124000000,
  successfulJourneys: 2459,
  countriesActive: 67,
  traditionalKnowledgeContributions: 156
};

export const HackathonDemoController: React.FC = () => {
  const [currentAct, setCurrentAct] = useState(1);
  const [demoProgress, setDemoProgress] = useState(0);
  const [networkStats, setNetworkStats] = useState(initialNetworkStats);
  const [isAnimating, setIsAnimating] = useState(false);

  const acts = [
    { id: 1, title: 'The Challenge', duration: 2, description: 'Life-saving treatment out of reach' },
    { id: 2, title: 'Treatment Discovery', duration: 3, description: 'Advanced medical solutions found' },
    { id: 3, title: 'Global Sponsorship', duration: 3, description: 'Decentralized funding secured' },
    { id: 4, title: 'Milestone Verification', duration: 4, description: 'Treatment progress tracked' },
    { id: 5, title: 'Research Impact', duration: 2, description: 'Advancing global medicine' },
    { id: 6, title: 'Treatment Success', duration: 1, description: 'Global impact achieved' }
  ];

  const nextAct = () => {
    if (currentAct < acts.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentAct(currentAct + 1);
        setDemoProgress((currentAct / acts.length) * 100);
        setIsAnimating(false);
      }, 500);
    }
  };

  const simulateMilestoneCompletion = () => {
    setIsAnimating(true);
    // Simulate milestone completion animation
    setTimeout(() => {
      // Update network stats to show impact
      setNetworkStats(prev => ({
        ...prev,
        successfulJourneys: prev.successfulJourneys + 1,
        fundsRaised: prev.fundsRaised + 25000
      }));
      setIsAnimating(false);
    }, 2000);
  };

  const simulateGlobalImpact = () => {
    setIsAnimating(true);
    // Animate global network growth
    setTimeout(() => {
      setNetworkStats(prev => ({
        ...prev,
        totalPatients: prev.totalPatients + 25,
        totalSponsors: prev.totalSponsors + 37,
        fundsRaised: prev.fundsRaised + 125000,
        countriesActive: prev.countriesActive + 2
      }));
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      {/* Demo Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">
            🧬 Ubuntu Health Demo - DeSci Builders Hackathon
          </h1>
          <p className="text-xl text-orange-600 mb-4">
            "I am because we are" - The First Healthcare Network State
          </p>
          <Progress value={demoProgress} className="w-full max-w-md mx-auto" />
        </div>

        {/* Act Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {acts.map((act) => (
            <Badge
              key={act.id}
              variant={currentAct === act.id ? "default" : "secondary"}
              className={`px-3 py-1 cursor-pointer transition-all ${
                currentAct === act.id ? 'bg-orange-600 text-white' : 
                currentAct > act.id ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setCurrentAct(act.id)}
            >
              Act {act.id}: {act.title}
            </Badge>
          ))}
        </div>
      </div>

      {/* Act Content */}
      <div className="max-w-7xl mx-auto">
        {currentAct === 1 && <Act1Challenge />}
        {currentAct === 2 && <Act2Journey />}
        {currentAct === 3 && <Act3Sponsorship />}
        {currentAct === 4 && <Act4Milestones simulateCompletion={simulateMilestoneCompletion} />}
        {currentAct === 5 && <Act5Research />}
        {currentAct === 6 && <Act6Transformation networkStats={networkStats} />}
      </div>

      {/* Demo Controls */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button
          onClick={nextAct}
          disabled={currentAct >= acts.length}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Next Act →
        </Button>
        <Button
          onClick={simulateGlobalImpact}
          variant="outline"
          className="border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          <Globe className="w-4 h-4 mr-2" />
          Show Global Impact
        </Button>
      </div>

      {/* Global Network Stats Overlay */}
      <div className="fixed top-6 right-6">
        <Card className="w-80 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-orange-800 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Ubuntu Health Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-bold text-orange-800">{networkStats.totalPatients.toLocaleString()}</div>
                <div className="text-orange-600">Patients</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-800">{networkStats.totalSponsors.toLocaleString()}</div>
                <div className="text-green-600">Sponsors</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-bold text-blue-800">{networkStats.totalHealers.toLocaleString()}</div>
                <div className="text-blue-600">Healers</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="font-bold text-purple-800">{networkStats.countriesActive}</div>
                <div className="text-purple-600">Countries</div>
              </div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="font-bold text-yellow-800">${networkStats.fundsRaised.toLocaleString()}</div>
              <div className="text-yellow-600">Total Funds Raised</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Act Components
const Act1Challenge: React.FC = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <Heart className="w-5 h-5 mr-2" />
          Meet Sarah
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
              👩🏾
            </div>
            <div>
              <h3 className="font-semibold">{demoPatient.name}</h3>
              <p className="text-sm text-gray-600">{demoPatient.location}</p>
              <p className="text-sm font-medium text-orange-600">{demoPatient.condition}</p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">The Challenge</h4>
            <p className="text-sm text-gray-700">
              Sarah needs $400K CAR-T cell therapy for Stage 2 breast cancer. Insurance denied coverage 
              because it's experimental. Treatment available at only 12 facilities globally with 6-month optimal window. 
              But what if global sponsors could make cutting-edge treatments accessible through blockchain verification?
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <Globe className="w-5 h-5 mr-2" />
          Ubuntu Health Solution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">"I am because we are"</h4>
            <p className="text-sm text-gray-700">
              Ubuntu Health democratizes access to advanced medical treatments - 
              where cutting-edge procedures meet blockchain sponsorship, 
              where global funding creates local access to life-saving innovation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-blue-50 p-3 rounded">
              <Shield className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <div className="text-xs font-semibold">Medical Data Protection</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <Users className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <div className="text-xs font-semibold">Community Sponsorship</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const Act2Journey: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-800">Creating Sarah's CAR-T Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Medical Consultation
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Dr. Hansen, oncologist at Swiss Cancer Research Institute with CAR-T expertise
            </p>
            <Badge variant="secondary">Kikuyu Traditions</Badge>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Knowledge Protection
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Sacred healing knowledge encrypted with cultural protocol compliance
            </p>
            <Badge variant="secondary">Zero-Knowledge Privacy</Badge>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Medical Integration
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              FHIR/HL7 integration with modern healthcare systems
            </p>
            <Badge variant="secondary">Healthcare Interoperability</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const Act3Sponsorship: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-800">Global Sponsorship Discovery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {demoSponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{sponsor.avatar}</div>
                <div>
                  <h4 className="font-semibold">{sponsor.name}</h4>
                  <p className="text-sm text-gray-600">{sponsor.location}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Badge 
                  variant={sponsor.sponsorshipLevel === 'Platinum' ? 'default' : 'secondary'}
                  className={`${
                    sponsor.sponsorshipLevel === 'Platinum' ? 'bg-purple-600' :
                    sponsor.sponsorshipLevel === 'Gold' ? 'bg-yellow-600' :
                    sponsor.sponsorshipLevel === 'Silver' ? 'bg-gray-600' :
                    'bg-orange-600'
                  }`}
                >
                  {sponsor.sponsorshipLevel} Sponsor
                </Badge>
                <p className="text-sm text-gray-600">{sponsor.interest}</p>
                <div className="text-sm">
                  <div className="font-semibold">${sponsor.totalContributed.toLocaleString()} contributed</div>
                  <div className="text-gray-600">{sponsor.patientsSponsored} patients sponsored</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const Act4Milestones: React.FC<{ simulateCompletion: () => void }> = ({ simulateCompletion }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center justify-between">
          Milestone-Based Healing Progress
          <Button onClick={simulateCompletion} size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Next Milestone
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoPatient.milestones.map((milestone, index) => (
            <div key={milestone.id} className={`border rounded-lg p-4 ${
              milestone.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center">
                  {milestone.completed ? 
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> :
                    <Clock className="w-5 h-5 mr-2 text-gray-400" />
                  }
                  {milestone.title}
                </h4>
                {milestone.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ${milestone.fundsReleased.toLocaleString()} Released
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
              <div className="flex items-center space-x-4 text-xs">
                <span className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  {milestone.verificationMethod}
                </span>
                <span className="text-blue-600 font-medium">
                  {milestone.medicalProvider}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const Act5Research: React.FC = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-800">Privacy-Preserving Research Contribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Zero-Knowledge Research</h4>
            <p className="text-sm text-gray-600">
              Amara's healing journey contributes to global medical research through 
              zero-knowledge proofs, preserving privacy while advancing knowledge.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Traditional Knowledge Compensation</h4>
            <p className="text-sm text-gray-600">
              Elder Wanjiku receives fair compensation for traditional healing 
              knowledge that contributes to global healing advancement.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-800">Global Impact Measurement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Research Contributions</span>
            <Badge>156 Studies Enhanced</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Traditional Knowledge Protected</span>
            <Badge>203 Healers Compensated</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Global Healing Improvement</span>
            <Badge>47 Similar Cases Helped</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const Act6Transformation: React.FC<{ networkStats: DemoNetworkStats }> = ({ networkStats }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-800 text-center">
          🌍 Ubuntu Health Network State - Global Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-orange-800 mb-2">
            "I am because we are" - Healthcare Revolution in Action
          </h3>
          <p className="text-gray-600">
            Six months later: Amara is fully recovered, but her impact continues...
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg">
            <div className="text-3xl font-bold text-orange-800">{networkStats.successfulJourneys}</div>
            <div className="text-sm text-orange-600">Successful Healing Journeys</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-800">${(networkStats.fundsRaised/1000000).toFixed(1)}M</div>
            <div className="text-sm text-green-600">Community Funds Raised</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-800">{networkStats.countriesActive}</div>
            <div className="text-sm text-blue-600">Countries in Network</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-800">{networkStats.traditionalKnowledgeContributions}</div>
            <div className="text-sm text-purple-600">Traditional Knowledge Preserved</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-100 via-red-100 to-yellow-100 p-6 rounded-lg text-center">
          <h4 className="text-xl font-semibold mb-3 text-orange-800">
            🏆 The First Healthcare Network State is Born
          </h4>
          <p className="text-gray-700 mb-4">
            Ubuntu Health has proven that when technology serves community empowerment, 
            when traditional wisdom meets blockchain innovation, when "I am because we are" 
            guides healthcare decisions - everyone heals together.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-600" />
              <span>Community-Governed Healthcare</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-600" />
              <span>Traditional Knowledge Protected</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1 text-blue-600" />
              <span>Global Healing Network</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default HackathonDemoController;