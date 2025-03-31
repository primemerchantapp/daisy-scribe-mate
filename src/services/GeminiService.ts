
// This is a mock service for demo purposes
// In a real application, you would implement actual API calls to Gemini

const GEMINI_API_KEY = "AIzaSyAl7nmdOfPe07QdRiEYMqhvhkPfyUOhpWM";
const MODEL_ID = "gemini-2.5-pro-exp-03-25";
const API_ENDPOINT = "streamGenerateContent";

export const generateDocumentation = async (transcript: string): Promise<string> => {
  // In a real application, you would call the Gemini API here
  // For demo purposes, we're returning mock HTML after a delay
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock HTML response that would normally come from Gemini
  return `
    <h1>MASTER SOAP NOTE</h1>
    <h2>SUBJECTIVE</h2>
    <p><strong>Chief Complaint:</strong> "Routine annual physical exam."</p>
    <p><strong>History of Present Illness:</strong> Maria Santos presents today for her routine annual physical examination. She reports no specific complaints or concerns.</p>
    <p><strong>Past Medical History:</strong> [Placeholder]</p>
    <p><strong>Past Surgical History:</strong> [Placeholder]</p>
    <p><strong>Medications:</strong> [Placeholder]</p>
    <p><strong>Allergies:</strong> [Placeholder]</p>
    <p><strong>Family History:</strong> [Placeholder]</p>
    <p><strong>Social History:</strong> [Placeholder]</p>
    <p><strong>Review of Systems:</strong> Patient denies any positive findings across all systems reviewed.</p>
    
    <h2>OBJECTIVE</h2>
    <p><strong>Vital Signs:</strong></p>
    <ul>
      <li>Temperature: [Placeholder]</li>
      <li>Blood Pressure: [Placeholder]</li>
      <li>Heart Rate: [Placeholder]</li>
      <li>Respiratory Rate: [Placeholder]</li>
      <li>Oxygen Saturation: [Placeholder]</li>
      <li>Height: [Placeholder]</li>
      <li>Weight: [Placeholder]</li>
      <li>BMI: [Placeholder]</li>
    </ul>
    <p><strong>Physical Examination:</strong> Within normal limits</p>
    
    <h2>ASSESSMENT</h2>
    <p>Z00.00 - Encounter for general adult medical examination without abnormal findings</p>
    
    <h2>PLAN</h2>
    <p><strong>Diagnostic:</strong> CBC, fasting blood glucose, cholesterol panel</p>
    <p><strong>Treatment:</strong> Continue current health maintenance</p>
    <p><strong>Education:</strong> Advised on balanced diet and regular exercise</p>
    <p><strong>Follow-up:</strong> Annual physical examination in one year</p>
    
    <hr>
    
    <h1>NURSING NOTE</h1>
    <h2>PATIENT SUMMARY</h2>
    <p>Maria Santos arrived for routine annual physical examination. No complaints reported.</p>
    
    <h2>VITAL SIGNS</h2>
    <p>[Placeholder for vital signs]</p>
    
    <h2>NURSING INTERVENTIONS</h2>
    <p>Patient roomed and prepped for examination. Standard vital measurements taken.</p>
    
    <h2>PATIENT EDUCATION</h2>
    <p>Reinforced provider's recommendations regarding balanced diet and regular exercise.</p>
    
    <h2>HANDOFF</h2>
    <p>Patient discharged in stable condition with instructions to schedule follow-up after lab results are available.</p>
    
    <hr>
    
    <h1>INSURANCE & BILLING NOTE</h1>
    <h2>ENCOUNTER DETAILS</h2>
    <p><strong>Patient:</strong> Maria Santos</p>
    <p><strong>Date:</strong> 03/27/2025</p>
    <p><strong>Provider:</strong> [Placeholder]</p>
    <p><strong>Encounter Type:</strong> Preventive Service</p>
    
    <h2>CODING</h2>
    <p><strong>ICD-10 Diagnosis:</strong> Z00.00 (Encounter for general adult medical examination without abnormal findings)</p>
    <p><strong>CPT Procedure:</strong> 99395 (Periodic comprehensive preventive medicine reevaluation, 18-39 years)</p>
    
    <h2>MEDICAL NECESSITY</h2>
    <p>Annual preventive examination is covered under the patient's preventive care benefits.</p>
    
    <hr>
    
    <h1>PHARMACY NOTE</h1>
    <h2>MEDICATION REVIEW</h2>
    <p><strong>Current Medications:</strong> [Placeholder]</p>
    <p><strong>Allergies:</strong> [Placeholder]</p>
    
    <h2>NEW PRESCRIPTIONS</h2>
    <p>No new medications prescribed during this visit.</p>
    
    <h2>MEDICATION COUNSELING</h2>
    <p>No medication counseling required at this visit.</p>
    
    <hr>
    
    <h1>SOCIAL WORK NOTE</h1>
    <h2>SOCIAL DETERMINANTS SCREENING</h2>
    <p>Social determinants of health screening not performed during this routine visit. No concerns identified that would require social work intervention.</p>
    
    <h2>RECOMMENDATIONS</h2>
    <p>No social work services required at this time.</p>
    
    <hr>
    
    <h1>LEGAL & COMPLIANCE NOTE</h1>
    <h2>CONSENT STATUS</h2>
    <p>General consent for treatment obtained and documented in the electronic medical record.</p>
    
    <h2>DOCUMENTATION REVIEW</h2>
    <p>All required elements of the preventive visit are documented. No liability concerns identified.</p>
    
    <hr>
    
    <h1>ADMINISTRATIVE COORDINATION NOTE</h1>
    <h2>SCHEDULING</h2>
    <p>Annual physical examination scheduled for next year.</p>
    <p>Patient to be notified of lab results via preferred communication method.</p>
    
    <h2>REFERRALS</h2>
    <p>No referrals indicated at this time.</p>
    
    <h2>PATIENT COMMUNICATION</h2>
    <p>Patient prefers to receive lab results and other communications via [Placeholder].</p>
  `;
};
