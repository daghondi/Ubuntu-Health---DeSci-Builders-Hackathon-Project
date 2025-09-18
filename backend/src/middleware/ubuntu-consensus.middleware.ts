import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { UbuntuCommunityService } from '../services/ubuntu/community-consensus.service';
import { ElderCouncilService } from '../services/ubuntu/elder-council.service';

export interface UbuntuConsensusRequest extends Request {
  ubuntuConsensus?: {
    communityId: string;
    requiresElderApproval: boolean;
    consensusThreshold: number;
    votingPeriod: number;
  };
}

/**
 * Middleware to enforce Ubuntu community consensus for sensitive operations
 * Embodies the Ubuntu principle of collective decision-making
 */
export const ubuntuConsensusMiddleware = async (
  req: UbuntuConsensusRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, user } = req;
    const communityService = new UbuntuCommunityService();
    const elderService = new ElderCouncilService();

    // Extract Ubuntu community context from request
    const communityId = body.communityId || req.headers['x-ubuntu-community'] as string;
    const actionType = body.actionType || req.path.split('/').pop();

    if (!communityId) {
      res.status(400).json({
        error: 'Ubuntu community context required',
        ubuntu_wisdom: 'In Ubuntu, every action happens within community',
        message: 'Please specify your Ubuntu community for collective decision-making'
      });
      return;
    }

    // Check if user is a verified Ubuntu community member
    const isCommunityMember = await communityService.verifyMembership(
      user?.walletAddress,
      communityId
    );

    if (!isCommunityMember) {
      res.status(403).json({
        error: 'Ubuntu community membership required',
        ubuntu_wisdom: 'Ubuntu teaches us that belonging comes through recognition and acceptance',
        message: 'You must be a verified member of this Ubuntu community'
      });
      return;
    }

    // Determine consensus requirements based on action sensitivity
    const consensusRequirements = await determineConsensusRequirements(actionType, body);
    
    // For high-sensitivity actions, require Ubuntu community consensus
    if (consensusRequirements.requiresConsensus) {
      const existingConsensus = await communityService.checkExistingConsensus(
        communityId,
        actionType,
        body
      );

      if (!existingConsensus || !existingConsensus.approved) {
        // Initiate Ubuntu consensus process
        const consensusProposal = await communityService.createConsensusProposal({
          communityId,
          actionType,
          proposedBy: user?.walletAddress,
          actionData: body,
          consensusThreshold: consensusRequirements.threshold,
          requiresElderApproval: consensusRequirements.requiresElderApproval,
          votingPeriod: consensusRequirements.votingPeriod,
          ubuntuPrinciples: {
            collectiveResponsibility: true,
            communalDecisionMaking: true,
            elderWisdomConsultation: consensusRequirements.requiresElderApproval
          }
        });

        res.status(202).json({
          message: 'Ubuntu consensus required for this action',
          ubuntu_wisdom: 'In Ubuntu, important decisions are made together as a community',
          consensusProposal: {
            id: consensusProposal.id,
            status: 'pending_community_vote',
            votingEndsAt: consensusProposal.votingEndsAt,
            consensusThreshold: consensusRequirements.threshold,
            requiresElderApproval: consensusRequirements.requiresElderApproval
          },
          instructions: {
            next_steps: 'Community members will vote on this proposal',
            voting_period: `${consensusRequirements.votingPeriod} hours`,
            ubuntu_principle: 'Collective wisdom guides our decisions'
          }
        });
        return;
      }

      // If consensus exists and requires elder approval, verify it
      if (consensusRequirements.requiresElderApproval) {
        const elderApproval = await elderService.checkElderApproval(
          communityId,
          existingConsensus.id
        );

        if (!elderApproval) {
          res.status(403).json({
            error: 'Elder council approval pending',
            ubuntu_wisdom: 'Elder wisdom guides our most important decisions',
            message: 'This action requires blessing from the elder council',
            consensusStatus: {
              communityApproved: true,
              elderApprovalPending: true,
              nextSteps: 'Awaiting elder council review'
            }
          });
          return;
        }
      }

      // Attach consensus information to request for downstream use
      req.ubuntuConsensus = {
        communityId,
        requiresElderApproval: consensusRequirements.requiresElderApproval,
        consensusThreshold: consensusRequirements.threshold,
        votingPeriod: consensusRequirements.votingPeriod
      };

      logger.info('Ubuntu consensus verified for action', {
        actionType,
        communityId,
        user: user?.walletAddress,
        consensusId: existingConsensus.id
      });
    }

    next();
  } catch (error) {
    logger.error('Ubuntu consensus middleware error:', error);
    res.status(500).json({
      error: 'Ubuntu consensus verification failed',
      ubuntu_wisdom: 'Even in difficulty, the community supports each other',
      message: 'Please try again or contact community elders for guidance'
    });
  }
};

/**
 * Determine consensus requirements based on action type and sensitivity
 */
async function determineConsensusRequirements(actionType: string, actionData: any) {
  const requirements = {
    requiresConsensus: false,
    threshold: 0.51, // 51% by default
    requiresElderApproval: false,
    votingPeriod: 24 // hours
  };

  switch (actionType) {
    case 'approve-treatment-protocol':
      requirements.requiresConsensus = true;
      requirements.threshold = 0.67; // 67% consensus
      requirements.requiresElderApproval = true;
      requirements.votingPeriod = 48;
      break;

    case 'allocate-community-funds':
      requirements.requiresConsensus = true;
      requirements.threshold = 0.75; // 75% consensus for financial decisions
      requirements.requiresElderApproval = actionData.amount > 10000; // Large amounts need elder approval
      requirements.votingPeriod = 72;
      break;

    case 'onboard-traditional-healer':
      requirements.requiresConsensus = true;
      requirements.threshold = 0.60;
      requirements.requiresElderApproval = true; // Always require elder approval for healers
      requirements.votingPeriod = 48;
      break;

    case 'establish-healing-protocol':
      requirements.requiresConsensus = true;
      requirements.threshold = 0.67;
      requirements.requiresElderApproval = actionData.involvesTraditionalMedicine;
      requirements.votingPeriod = 48;
      break;

    case 'modify-ubuntu-principles':
      requirements.requiresConsensus = true;
      requirements.threshold = 0.80; // High threshold for philosophical changes
      requirements.requiresElderApproval = true;
      requirements.votingPeriod = 96; // Extended period for deep reflection
      break;

    case 'ban-community-member':
      requirements.requiresConsensus = true;
      requirements.threshold = 0.75;
      requirements.requiresElderApproval = true;
      requirements.votingPeriod = 72;
      break;

    default:
      // For routine operations, no consensus required
      requirements.requiresConsensus = false;
  }

  return requirements;
}

/**
 * Middleware specifically for elder council actions
 */
export const elderCouncilMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req;
    const elderService = new ElderCouncilService();

    const isElder = await elderService.verifyElderStatus(user?.walletAddress);

    if (!isElder) {
      res.status(403).json({
        error: 'Elder council access required',
        ubuntu_wisdom: 'Respect for elders is fundamental to Ubuntu philosophy',
        message: 'This action requires elder council authority'
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Elder council middleware error:', error);
    res.status(500).json({
      error: 'Elder verification failed',
      ubuntu_wisdom: 'Even elders seek guidance from the community',
      message: 'Please verify your elder status with the community'
    });
  }
};
