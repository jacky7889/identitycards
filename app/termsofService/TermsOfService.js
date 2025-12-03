"use client";
import { useState } from "react";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "account", title: "Account Registration" },
    { id: "services", title: "Card Services" },
    { id: "design-upload", title: "Design Upload" },
    { id: "card-specifications", title: "Card Specifications" },
    { id: "ordering-process", title: "Ordering Process" },
    { id: "payment-shipping", title: "Payment & Shipping" },
    { id: "data-protection", title: "Data Protection" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "compliance", title: "Compliance & Legal Use" },
    { id: "liability", title: "Liability & Warranty" },
    { id: "forged-documents", title: "Forged Documents" },
    { id: "termination", title: "Termination" },
    { id: "changes", title: "Changes to Terms" },
    // { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            For Identity Cards, Custom PVC Cards, ID Cards & Employee Cards
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              {/* Introduction */}
              <section id="introduction" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  {`Welcome to our professional card manufacturing service. These Terms of Service govern your access to and use of our identity card, custom PVC card, ID card, and employee card manufacturing services (collectively, the "Services").`}
                </p>
                <p className="text-gray-700">
                  By placing an order or using our Services, you agree to be bound by these Terms and our Privacy Policy. These Terms constitute a legally binding agreement between you and our company.
                </p>
              </section>

              {/* Definitions */}
              <section id="definitions" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>{`Card Products`}</strong> refers to physical identity cards, PVC cards, ID cards, employee cards, lanyards, and holders manufactured by us.
                  </li>
                  <li>
                    <strong>{`Design Files`}</strong> refers to any digital files uploaded by you for card customization.
                  </li>
                  <li>
                    <strong>{`Order`}</strong> refers to a formal request for Card Products submitted through our platform.
                  </li>
                  <li>
                    <strong>{`Sensitive Information`}</strong> refers to personal data including but not limited to names, photos, identification numbers, and employee details.
                  </li>
                  <li>
                    <strong>{`Production Ready Artwork`}</strong> refers to design files that meet our specified technical requirements.
                  </li>
                </ul>
              </section>

              {/* Account Registration */}
              <section id="account" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    To place orders for Card Products, you may be required to create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate business/organization information</li>
                    <li>Verify your identity for orders containing sensitive information</li>
                    <li>Maintain confidentiality of your account credentials</li>
                    <li>Notify us immediately of any unauthorized account access</li>
                    <li>Be solely responsible for all orders placed through your account</li>
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> For bulk orders of employee/identity cards, additional verification and business documentation may be required.
                    </p>
                  </div>
                </div>
              </section>

              {/* Card Services */}
              <section id="services" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Card Services</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We specialize in manufacturing various types of cards including:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Identity Cards</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Student ID cards</li>
                        <li>• Membership cards</li>
                        <li>• Access control cards</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Employee Cards</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Corporate ID cards</li>
                        <li>• Staff identification</li>
                        <li>• Visitor passes</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Custom PVC Cards</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Custom designs</li>
                        <li>• Branded cards</li>
                        <li>• Special finishes</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Accessories</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Lanyards</li>
                        <li>• Card holders</li>
                        <li>• Badge clips</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Design Upload */}
              <section id="design-upload" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Design Upload & Specifications</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    When uploading design files for card production, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide Production Ready Artwork in specified formats (AI, PSD, PDF, SVG)</li>
                    <li>Include proper bleed areas and safe zones</li>
                    <li>Use high-resolution images (minimum 300 DPI)</li>
                    <li>Convert text to outlines where required</li>
                    <li>Ensure designs meet our technical specifications</li>
                  </ul>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">File Requirements</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Format: PDF, AI, PSD, SVG, PNG (300 DPI)</li>
                      <li>• Color Mode: CMYK for printing</li>
                      <li>• Bleed: 3mm on all sides</li>
                      <li>• Safe Zone: 5mm from edges</li>
                    </ul>
                  </div>

                  <p>
                    We reserve the right to reject design files that do not meet our technical specifications. Additional charges may apply for design corrections.
                  </p>
                </div>
              </section>

              {/* Card Specifications */}
              <section id="card-specifications" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Card Specifications & Quality</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    All cards are manufactured to industry standards with the following specifications:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">PVC Cards</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Thickness: 0.76mm standard</li>
                        <li>• Material: Premium PVC</li>
                        <li>• Finish: Matte/Gloss options</li>
                        <li>• Durability: 2-5 years*</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">ID Cards</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Standard CR-80 size</li>
                        <li>• Magnetic stripe options</li>
                        <li>• Barcode printing available</li>
                        <li>• Holographic overlays</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Color Disclaimer:</strong> While we strive for color accuracy, final printed colors may vary slightly from digital designs due to printing processes and monitor calibration differences.
                    </p>
                  </div>
                </div>
              </section>

              {/* Ordering Process */}
              <section id="ordering-process" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Ordering Process</h2>
                <div className="space-y-4 text-gray-700">
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <strong>Design Submission:</strong> Upload your design files and specify requirements
                    </li>
                    <li>
                      <strong>Proof Approval:</strong> Review and approve digital proof before production
                    </li>
                    <li>
                      <strong>Production:</strong> Manufacturing begins after proof approval
                    </li>
                    <li>
                      <strong>Quality Check:</strong> All cards undergo quality inspection
                    </li>
                    <li>
                      <strong>Shipping:</strong> Cards are shipped via chosen delivery method
                    </li>
                  </ol>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                      <strong>Important:</strong> Once production begins, orders cannot be cancelled or modified. Ensure all details are correct before approving the proof.
                    </p>
                  </div>
                </div>
              </section>

              {/* Payment & Shipping */}
              <section id="payment-shipping" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Payment & Shipping</h2>
                <div className="space-y-4 text-gray-700">
                  <h4 className="font-semibold text-gray-900">Payment Terms</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Full payment required before production begins</li>
                    <li>We accept major credit cards and bank transfers</li>
                    <li>Bulk orders (500+ cards) may qualify for payment terms</li>
                    <li>All prices exclude taxes and shipping costs</li>
                  </ul>

                  <h4 className="font-semibold text-gray-900 mt-4">Shipping & Delivery</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Production time: 5-10 business days (standard orders)</li>
                    <li>Express production available at additional cost</li>
                    <li>Shipping time varies by destination and method</li>
                    <li>Tracking information provided for all shipments</li>
                    <li>International shipping available</li>
                  </ul>
                </div>
              </section>

              {/* Data Protection */}
              <section id="data-protection" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Protection & Confidentiality</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We take data protection seriously, especially for identity and employee cards containing sensitive information:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All uploaded data is encrypted during transmission and storage</li>
                    <li>Design files are permanently deleted 30 days after order completion</li>
                    <li>We do not store credit card information</li>
                    <li>Employee data is processed only for card production purposes</li>
                    <li>We comply with applicable data protection regulations</li>
                  </ul>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Your Responsibility:</strong> You warrant that you have obtained necessary permissions and consents for using personal data in card production, and that you comply with all applicable privacy laws.
                    </p>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual-property" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Intellectual Property</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    You retain all intellectual property rights to your designs and content. By submitting designs, you grant us a limited license to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reproduce the design for card production</li>
                    <li>Make necessary technical adjustments for printing</li>
                    <li>Store the design temporarily for order processing</li>
                  </ul>
                  <p>
                    We retain intellectual property rights to our printing processes, software, and proprietary techniques.
                  </p>
                </div>
              </section>

              {/* Compliance & Legal Use */}
              <section id="compliance" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Compliance & Legal Use</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    You agree not to use our Services for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Creating counterfeit identification documents</li>
                    <li>Producing cards for fraudulent purposes</li>
                    <li>Violating any government regulations</li>
                    <li>Infringing on third-party intellectual property</li>
                    <li>Creating cards that mimic official government documents</li>
                  </ul>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                      <strong>Legal Compliance:</strong> We reserve the right to refuse service and report to authorities any orders that appear to violate laws or regulations. Production of official government identification documents requires proper authorization.
                    </p>
                  </div>
                </div>
              </section>

              {/* Liability & Warranty */}
              <section id="liability" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Liability & Warranty</h2>
                <div className="space-y-4 text-gray-700">
                  <h4 className="font-semibold text-gray-900">Warranty</h4>
                  <p>
                    We warrant that all cards will be free from manufacturing defects for 90 days from delivery. This warranty covers:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Material defects in PVC/card stock</li>
                    <li>Printing errors not present in approved proof</li>
                    <li>Structural failures under normal use</li>
                  </ul>

                  <h4 className="font-semibold text-gray-900 mt-4">Limitation of Liability</h4>
                  <p>
                    Our total liability for any claim shall not exceed the order value. We are not liable for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Color variations from digital proofs</li>
                    <li>Design errors in customer-provided artwork</li>
                    <li>Delays caused by shipping carriers</li>
                    <li>Consequential or indirect damages</li>
                  </ul>
                </div>
              </section>

                   {/* Forged Document */}
              <section id="forged-documents" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Forgery under Bharatiya Nyaya Sanhita (BNS, 2023)</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Section 337 BNS — Forgery of Public Records / Government-issued IDs:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>This section applies when someone forges a document or electronic record that is a public record such as a government-issued identity document (e.g. a “voter identity card”, or an Aadhaar-type ID).</li>
                    <li>Punishment: imprisonment (of either description) for up to 7 years, plus fine.</li>
                    <li>This is the relevant section if, for example, someone forges a “fake ID card” purporting to be a legitimate government-issued ID.</li>
                  </ul>

                  <p>
                    Section 336 BNS — General Forgery (Documents / Electronic Records)
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Punishment: General forgery (without further fraudulent intent): up to 2 years imprisonment, or fine or both.</li>
                    <li>Forgery with intent to cheat (i.e. using the forged document to cheat someone): up to 7 years imprisonment + fine</li>
                   </ul>
                    <p>
                    Any order found to be forged, fraudulent, lacking higher-authority approval, or missing required legal documents may be cancelled without notice. No refunds will be provided under such circumstances.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section id="termination" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Termination</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may suspend or terminate your account and refuse service if:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You breach these Terms of Service</li>
                    <li>We suspect fraudulent or illegal activity</li>
                    <li>You provide false information</li>
                    <li>Required payments are not made</li>
                  </ul>
                  <p>
                    You may terminate your account at any time by contacting customer service. Outstanding orders must be completed before account closure.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to Terms</h2>
                <p className="text-gray-700">
                  We may update these Terms periodically. Continued use of our Services after changes constitutes acceptance of the modified Terms. Material changes will be communicated via email or platform notification.
                </p>
              </section>

              {/* Contact Information */}
              <section id="contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms or our card services, contact us:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Card Production Department</strong><br />
                    <strong>Email:</strong> info@identitycards.co.in<br />
                    {/* <strong>Phone:</strong> [Your Contact Number]<br />
                    <strong>Address:</strong> [Your Company Address]<br /> */}
                    <strong>Business Hours:</strong> Mon-Fri, 9AM-6PM (IST)
                  </p>
                </div>
              </section>

              {/* Acceptance */}
              <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Acceptance of Terms</h3>
                <p className="text-blue-800">
                  By placing an order for identity cards, custom PVC cards, ID cards, or employee cards, you acknowledge that you have read, understood, and agree to be bound by these specialized Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}