#!/usr/bin/env node
// Ubuntu Health - Hackathon Demo Simulation Script
// Interactive terminal demo for hackathon presentation

const readline = require('readline');
const chalk = require('chalk');

// Demo data
const demoData = {
  patient: {
    name: 'Amara Wanjiku',
    location: 'Nairobi, Kenya',
    condition: 'Complex Cardiac Surgery Required',
    traditionalHealer: 'Elder Wanjiku',
    culturalBackground: 'Kikuyu healing traditions',
    sponsorshipGoal: 25000,
    sponsorshipRaised: 18750
  },
  sponsors: [
    {
      name: 'Dr. Sarah Mitchell',
      location: 'Toronto, Canada',
      level: 'Gold',
      contributed: 15000,
      interest: 'Traditional-Modern Integration Research'
    },
    {
      name: 'James Weber',
      location: 'Berlin, Germany',
      level: 'Silver',
      contributed: 8500,
      interest: 'Community-Powered Healthcare Innovation'
    },
    {
      name: 'Maria Santos',
      location: 'São Paulo, Brazil',
      level: 'Platinum',
      contributed: 32000,
      interest: 'Traditional Healing Knowledge Preservation'
    }
  ],
  milestones: [
    {
      title: 'Traditional Consultation',
      description: 'Elder Wanjiku consultation and traditional healing assessment',
      completed: true,
      fundsReleased: 2500,
      witnesses: 12,
      traditionalElement: 'Herbal preparation guidance'
    },
    {
      title: 'Medical Evaluation',
      description: 'Comprehensive medical evaluation and treatment planning',
      completed: true,
      fundsReleased: 5000,
      witnesses: 8,
      traditionalElement: 'Integration with modern diagnostics'
    },
    {
      title: 'Surgery & Recovery',
      description: 'Surgical intervention with traditional healing support',
      completed: true,
      fundsReleased: 15000,
      witnesses: 15,
      traditionalElement: 'Post-surgery traditional recovery methods'
    },
    {
      title: 'Community Reintegration',
      description: 'Full recovery and community healing celebration',
      completed: false,
      fundsReleased: 0,
      witnesses: 0,
      traditionalElement: 'Community healing ceremony'
    }
  ],
  networkStats: {
    totalPatients: 847,
    totalSponsors: 1205,
    totalHealers: 203,
    fundsRaised: 2450000,
    successfulJourneys: 312,
    countriesActive: 43,
    traditionalKnowledgeContributions: 156
  }
};

class HackathonDemo {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.currentAct = 0;
    this.acts = [
      'The Challenge',
      'Creating Healing Journey',
      'Global Sponsorship Discovery',
      'Milestone-Based Progress',
      'Research Contribution',
      'Ubuntu Health Transformation'
    ];
  }

  async start() {
    console.clear();
    this.showHeader();
    await this.waitForInput('\nPress Enter to begin the Ubuntu Health Demo...');
    await this.runDemo();
  }

  showHeader() {
    console.log(chalk.bold.orange('🌍 UBUNTU HEALTH - DESCI BUILDERS HACKATHON DEMO'));
    console.log(chalk.orange('"I am because we are" - The First Healthcare Network State\n'));
    console.log(chalk.gray('═'.repeat(80)));
  }

  async runDemo() {
    for (let i = 0; i < this.acts.length; i++) {
      this.currentAct = i;
      await this.runAct(i + 1);
    }
    await this.showConclusion();
  }

  async runAct(actNumber) {
    console.clear();
    this.showProgress();
    console.log(chalk.bold.yellow(`\n🎬 ACT ${actNumber}: ${this.acts[actNumber - 1].toUpperCase()}`));
    console.log(chalk.gray('─'.repeat(60)));

    switch (actNumber) {
      case 1: await this.showAct1(); break;
      case 2: await this.showAct2(); break;
      case 3: await this.showAct3(); break;
      case 4: await this.showAct4(); break;
      case 5: await this.showAct5(); break;
      case 6: await this.showAct6(); break;
    }

    await this.waitForInput(chalk.cyan('\nPress Enter to continue...'));
  }

  showProgress() {
    const progress = Math.round((this.currentAct / this.acts.length) * 100);
    const progressBar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
    console.log(chalk.cyan(`Progress: [${progressBar}] ${progress}%`));
  }

  async showAct1() {
    console.log(chalk.bold.red('\n💔 THE CHALLENGE: When Traditional Meets Modern Healthcare Gaps\n'));
    
    console.log(chalk.bold('👩🏾 Meet Amara Wanjiku'));
    console.log(`📍 Location: ${chalk.green(demoData.patient.location)}`);
    console.log(`🏥 Condition: ${chalk.red(demoData.patient.condition)}`);
    console.log(`🌿 Traditional Healer: ${chalk.green(demoData.patient.traditionalHealer)}`);
    console.log(`🎭 Cultural Background: ${chalk.blue(demoData.patient.culturalBackground)}`);
    
    await this.typeText('\n💭 The Problem:', 500);
    await this.typeText('\nAmara needs specialized cardiac surgery costing $25,000.', 100);
    await this.typeText('\nTraditional healthcare systems offer limited options:', 100);
    await this.typeText('\n  • Expensive private care she cannot afford', 150);
    await this.typeText('\n  • Public systems with dangerous waiting times', 150);
    await this.typeText('\n  • Loss of cultural healing wisdom in the process', 150);
    
    await this.typeText('\n\n🌟 Ubuntu Health Solution:', 500);
    await this.typeText('\nWhat if the global community could sponsor her healing', 100);
    await this.typeText('\nwhile respecting and preserving her cultural wisdom?', 100);
    await this.typeText('\n\n"I am because we are" becomes reality.', 200);
  }

  async showAct2() {
    console.log(chalk.bold.green('\n🌱 CREATING THE HEALING JOURNEY: Community-Powered Healthcare Discovery\n'));
    
    await this.typeText('🔄 Step 1: Traditional Consultation', 300);
    console.log(`\n  👵 ${chalk.green(demoData.patient.traditionalHealer)} - 40 years of Kikuyu healing wisdom`);
    console.log(`  🌿 Sacred knowledge documented with cultural respect`);
    console.log(`  🔒 Advanced encryption protects traditional wisdom`);
    
    await this.typeText('\n🔄 Step 2: Cultural Protocol Compliance', 300);
    console.log(`\n  ✅ Automated respect for cultural protocols`);
    console.log(`  ✅ Elder Council approval workflows`);
    console.log(`  ✅ Traditional authority recognition`);
    
    await this.typeText('\n🔄 Step 3: Medical Integration', 300);
    console.log(`\n  🏥 FHIR/HL7 compatibility with modern healthcare`);
    console.log(`  🔗 Seamless EHR integration`);
    console.log(`  💊 Traditional healing + modern medicine harmony`);
    
    await this.typeText('\n\n🎯 Journey Created Successfully!', 500);
    await this.typeText('\nGoal: $' + demoData.patient.sponsorshipGoal.toLocaleString(), 200);
  }

  async showAct3() {
    console.log(chalk.bold.blue('\n🌍 GLOBAL SPONSORSHIP DISCOVERY: The World Becomes Your Community\n'));
    
    await this.typeText('🔍 AI-Powered Sponsor Matching Active...', 500);
    
    for (let i = 0; i < demoData.sponsors.length; i++) {
      const sponsor = demoData.sponsors[i];
      await this.typeText(`\n\n${i + 1}. 👤 ${chalk.bold(sponsor.name)}`, 300);
      console.log(`   📍 ${sponsor.location}`);
      console.log(`   ⭐ ${sponsor.level} Sponsor`);
      console.log(`   💰 $${sponsor.contributed.toLocaleString()} contributed`);
      console.log(`   🎯 Interest: ${chalk.cyan(sponsor.interest)}`);
      
      await this.typeText(`   ✅ ${chalk.green('MATCHED!')} Cultural compatibility confirmed`, 200);
    }
    
    await this.typeText('\n\n🚀 Smart Contract Escrow Deployment...', 500);
    await this.typeText('\n  📝 Milestone conditions programmed', 200);
    await this.typeText('\n  🔒 Funds secured in escrow', 200);
    await this.typeText('\n  👥 Community witness verification enabled', 200);
    
    console.log(chalk.bold.green('\n✅ SPONSORSHIP SECURED!'));
    console.log(`💰 Total Raised: $${demoData.patient.sponsorshipRaised.toLocaleString()} / $${demoData.patient.sponsorshipGoal.toLocaleString()}`);
  }

  async showAct4() {
    console.log(chalk.bold.purple('\n🎯 MILESTONE-BASED PROGRESS: Trust Through Transparency\n'));
    
    for (let i = 0; i < demoData.milestones.length; i++) {
      const milestone = demoData.milestones[i];
      const status = milestone.completed ? '✅' : '⏳';
      const color = milestone.completed ? chalk.green : chalk.yellow;
      
      console.log(color(`\n${status} ${milestone.title}`));
      console.log(`   📝 ${milestone.description}`);
      console.log(`   🌿 Traditional Element: ${chalk.cyan(milestone.traditionalElement)}`);
      
      if (milestone.completed) {
        console.log(`   💰 Funds Released: $${milestone.fundsReleased.toLocaleString()}`);
        console.log(`   👥 Community Witnesses: ${milestone.witnesses}`);
        await this.typeText(`   ✅ ${chalk.green('Verified by community')}`, 200);
      } else {
        await this.typeText(`   ⏳ ${chalk.yellow('Awaiting completion...')}`, 200);
        console.log('\n🎬 SIMULATING MILESTONE COMPLETION...');
        await this.simulateMilestoneCompletion();
        console.log(chalk.green('   ✅ MILESTONE COMPLETED!'));
        console.log(`   💰 Funds Released: $${2500}`);
        console.log(`   👥 Community Witnesses: ${18}`);
        console.log(`   🎉 Community celebration activated!`);
        break;
      }
    }
  }

  async simulateMilestoneCompletion() {
    const steps = [
      '📸 Uploading recovery documentation...',
      '🔐 Cryptographic timestamping...',
      '👥 Community witness verification...',
      '🔗 Smart contract validation...',
      '💰 Automatic fund release...'
    ];
    
    for (const step of steps) {
      await this.typeText(`\n   ${step}`, 300);
    }
  }

  async showAct5() {
    console.log(chalk.bold.magenta('\n🔬 RESEARCH CONTRIBUTION: Healing Knowledge That Heals the World\n'));
    
    await this.typeText('🧬 Zero-Knowledge Research Contribution Active...', 500);
    console.log('\n  🔒 Privacy-preserving data analysis');
    console.log('  🌍 Global medical research enhancement');
    console.log('  💰 Fair compensation for traditional knowledge');
    
    await this.typeText('\n📊 Research Impact Statistics:', 300);
    console.log(`\n  📚 Studies Enhanced: ${demoData.networkStats.traditionalKnowledgeContributions}`);
    console.log(`  👥 Healers Compensated: ${demoData.networkStats.totalHealers}`);
    console.log(`  🌍 Global Cases Helped: 47 similar conditions`);
    
    await this.typeText('\n💡 Traditional Knowledge Value Creation:', 300);
    console.log(`\n  💰 Elder Wanjiku earnings: $2,400 this month`);
    console.log(`  🏘️  Community benefit fund: $8,500 contributed`);
    console.log(`  📈 Knowledge preservation: 156 healing methods documented`);
    
    await this.typeText('\n\n🌟 Ubuntu Philosophy in Action:', 500);
    await this.typeText('\n"When traditional knowledge helps heal the world,', 200);
    await this.typeText('\n the world pays it forward."', 200);
  }

  async showAct6() {
    console.log(chalk.bold.rainbow('\n🏆 UBUNTU HEALTH TRANSFORMATION: Building the First Healthcare Network State\n'));
    
    await this.typeText('📈 Six Months Later - Global Impact Visualization...', 500);
    
    console.log(chalk.bold('\n🎯 AMARA\'S SUCCESS STORY:'));
    console.log('  ❤️  Fully recovered and healthy');
    console.log('  👥 Now a community witness for 12 other journeys');
    console.log('  🌍 Her story inspired 47 similar healing journeys');
    
    console.log(chalk.bold('\n🌿 ELDER WANJIKU\'S IMPACT:'));
    console.log('  💰 $15,600 earned from traditional knowledge sharing');
    console.log('  🌍 Healing wisdom helped 47 people globally');
    console.log('  📚 Traditional methods now in global research database');
    
    console.log(chalk.bold('\n🌍 UBUNTU HEALTH NETWORK STATE:'));
    for (const [key, value] of Object.entries(demoData.networkStats)) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`  📊 ${label}: ${typeof value === 'number' ? value.toLocaleString() : value}`);
    }
    
    await this.typeText('\n\n🌟 THE UBUNTU REVOLUTION:', 800);
    await this.typeText('\n\nWe have proven that when technology serves community empowerment,', 200);
    await this.typeText('\nwhen traditional wisdom meets blockchain innovation,', 200);
    await this.typeText('\nwhen "I am because we are" guides healthcare decisions...', 200);
    await this.typeText('\n\nEVERYONE HEALS TOGETHER! 🌍💚', 500);
  }

  async showConclusion() {
    console.clear();
    console.log(chalk.bold.rainbow('🏆 UBUNTU HEALTH - HACKATHON DEMO COMPLETE! 🏆\n'));
    
    console.log(chalk.bold.green('🎯 WHAT WE DEMONSTRATED:'));
    console.log('  ✅ Complete healing journey lifecycle (Patient → Sponsors → Recovery)');
    console.log('  ✅ Smart contract innovation with milestone-based escrow');
    console.log('  ✅ Traditional knowledge protection and fair compensation');
    console.log('  ✅ Zero-knowledge privacy for research contributions');
    console.log('  ✅ Cultural protocol automation and respect systems');
    console.log('  ✅ Global community sponsorship and matching algorithms');
    console.log('  ✅ Network State model for post-national healthcare organization');
    
    console.log(chalk.bold.blue('\n💡 TECHNICAL INNOVATIONS:'));
    console.log('  🔗 Solana blockchain with Rust smart contracts');
    console.log('  🔒 Zero-knowledge proofs for privacy-preserving research');
    console.log('  🏥 FHIR/HL7 integration for healthcare interoperability');
    console.log('  🌿 Cultural protocol automation with Elder Council governance');
    console.log('  💰 $LIVES token economics with community staking rewards');
    console.log('  📱 Cross-platform applications (Web, Mobile, Desktop)');
    
    console.log(chalk.bold.orange('\n🌍 SOCIAL IMPACT:'));
    console.log('  👥 Healthcare access democratization through global sponsorship');
    console.log('  🌿 Traditional knowledge preservation with fair compensation');
    console.log('  🏘️  Community empowerment through decentralized governance');
    console.log('  🌍 First Healthcare Network State transcending national boundaries');
    console.log('  💚 Ubuntu philosophy "I am because we are" in technological action');
    
    console.log(chalk.bold.yellow('\n🚀 READY FOR DEPLOYMENT:'));
    console.log('  📋 8/8 Major components complete and tested');
    console.log('  🔐 Smart contracts ready for security audit');
    console.log('  🌍 Multi-jurisdiction regulatory framework prepared');
    console.log('  👥 Community pilot programs ready to launch');
    console.log('  📱 Mobile applications in development');
    
    await this.typeText(chalk.bold.rainbow('\n\n"Ubuntu Health: Proving that healthcare technology can serve'), 300);
    await this.typeText(chalk.bold.rainbow('\n community empowerment, showing the world that'), 300);
    await this.typeText(chalk.bold.rainbow('\n I am because we are." 🌍💚\n'), 300);
    
    console.log(chalk.gray('Thank you for witnessing the Ubuntu Health revolution!'));
    console.log(chalk.gray('Questions? Let\'s discuss how we can heal the world together.\n'));
    
    this.rl.close();
  }

  async typeText(text, delay = 100) {
    return new Promise((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        process.stdout.write(text[i]);
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  }

  async waitForInput(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, () => {
        resolve();
      });
    });
  }
}

// Add rainbow color support
chalk.rainbow = (text) => {
  const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
  return text.split('').map((char, i) => 
    chalk[colors[i % colors.length]](char)
  ).join('');
};

// Start the demo
const demo = new HackathonDemo();
demo.start().catch(console.error);