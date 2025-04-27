import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    console.log('Starting to clear all rate limits...')

    // First, let's see what's in the rate limits table
    const { data: existingLimits, error: selectError } = await supabase
      .from('email_rate_limits')
      .select('*')

    if (selectError) {
      console.error('Error selecting rate limits:', selectError)
    } else {
      console.log('Existing rate limits:', existingLimits)
    }

    // Clear all rate limits
    const { error: rateLimitError } = await supabase
      .from('email_rate_limits')
      .delete()
      .neq('email', '') // Delete all records

    if (rateLimitError) {
      console.error('Error clearing rate limits:', rateLimitError)
      return NextResponse.json(
        { error: rateLimitError.message },
        { status: 500 }
      )
    }

    console.log('Successfully cleared all rate limits')

    // Mark all active codes as used
    const { error: codeError } = await supabase
      .from('email_codes')
      .update({ used: true })
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())

    if (codeError) {
      console.error('Error clearing codes:', codeError)
      return NextResponse.json(
        { error: codeError.message },
        { status: 500 }
      )
    }

    console.log('Successfully marked all active codes as used')

    // Verify the rate limits are cleared
    const { data: remainingLimits, error: verifyError } = await supabase
      .from('email_rate_limits')
      .select('*')

    if (verifyError) {
      console.error('Error verifying rate limits:', verifyError)
    } else {
      console.log('Remaining rate limits after clear:', remainingLimits)
    }

    return NextResponse.json({ 
      success: true,
      message: 'All rate limits and active codes have been cleared'
    })
  } catch (error) {
    console.error('Error in clear-limits API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to clear limits' },
      { status: 500 }
    )
  }
} 