import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { role, data, completedSteps } = await request.json();

    // Update user with onboarding completion status
    await prisma.user.update({
      where: { id: session.id },
      data: {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      }
    });

    // Update role-specific profile based on role
    switch (role) {
      case 'client':
        await prisma.clientProfile.upsert({
          where: { userId: session.id },
          create: {
            userId: session.id,
            preferredLocation: data.location?.areas || '',
            budgetMin: data.budget?.minBudget ? parseInt(data.budget.minBudget) : null,
            budgetMax: data.budget?.maxBudget ? parseInt(data.budget.maxBudget) : null,
            propertyType: data.preferences?.propertyType || null,
            bedrooms: data.preferences?.bedrooms || null,
            state: data.location?.state || '',
          },
          update: {
            preferredLocation: data.location?.areas || '',
            budgetMin: data.budget?.minBudget ? parseInt(data.budget.minBudget) : null,
            budgetMax: data.budget?.maxBudget ? parseInt(data.budget.maxBudget) : null,
            propertyType: data.preferences?.propertyType || null,
            bedrooms: data.preferences?.bedrooms || null,
            state: data.location?.state || '',
          }
        });
        break;

      case 'agent':
        await prisma.agentProfile.upsert({
          where: { userId: session.id },
          create: {
            userId: session.id,
            // Add agent-specific onboarding data
            bio: data.profile?.bio || '',
            experience: data.profile?.experience || '',
            specialization: data.profile?.specialization || '',
          },
          update: {
            bio: data.profile?.bio || '',
            experience: data.profile?.experience || '',
            specialization: data.profile?.specialization || '',
          }
        });
        break;

      case 'inspector':
        await prisma.inspectorProfile.upsert({
          where: { userId: session.id },
          create: {
            userId: session.id,
            location: data.location?.serviceAreas || '',
            availabilityRadius: data.location?.radius ? parseInt(data.location.radius) : 50,
            // Add other inspector-specific fields
          },
          update: {
            location: data.location?.serviceAreas || '',
            availabilityRadius: data.location?.radius ? parseInt(data.location.radius) : 50,
          }
        });
        break;

      case 'company':
        // Update company profile if needed
        break;
    }

    // Store onboarding completion metadata
    await prisma.user.update({
      where: { id: session.id },
      data: {
        // Store completed steps as JSON if needed
        // onboardingSteps: JSON.stringify(completedSteps),
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      redirectTo: `/${role}`
    });

  } catch (error) {
    console.error('Onboarding completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}