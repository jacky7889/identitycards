"use client";
import { useState } from "react";


export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collection", title: "Information We Collect" },
    { id: "how-we-use", title: "How We Use Information" },
    { id: "data-sharing", title: "Data Sharing & Disclosure" },
    { id: "data-protection", title: "Data Protection" },
    { id: "data-retention", title: "Data Retention" },
    { id: "your-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies & Tracking" },
    { id: "third-party", title: "Third-Party Services" },
    { id: "international", title: "International Transfers" },
    { id: "children", title: "Children's Privacy" },
    { id: "changes", title: "Policy Changes" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Protecting Your Data in Identity Card Manufacturing
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
                  At Identity Cards India, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our identity card, PVC card, and custom card manufacturing services.
                </p>
                <p className="text-gray-700">
                  We comply with applicable data protection laws, including the Information Technology Act, 2000 and its corresponding rules in India. By using our services, you consent to the practices described in this policy.
                </p>
              </section>

              {/* Information We Collect */}
              <section id="information-collection" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>
                        <strong>Contact Information:</strong> Name, email address, phone number, business address
                      </li>
                      <li>
                        <strong>Business Information:</strong> Company name, tax identification numbers, business registration details
                      </li>
                      <li>
                        <strong>Billing Information:</strong> Payment details, billing address, transaction history
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Card Production Data</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>
                        <strong>Design Files:</strong> Uploaded images, logos, and design elements for card production
                      </li>
                      <li>
                        <strong>Card Content:</strong> Employee names, photos, identification numbers, department information
                      </li>
                      <li>
                        <strong>Specifications:</strong> Card size, material preferences, printing requirements
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>
                        <strong>Device Information:</strong> IP address, browser type, operating system
                      </li>
                      <li>
                        <strong>Usage Data:</strong> Pages visited, time spent, features used
                      </li>
                      <li>
                        <strong>Cookies Data:</strong> Session information, preferences
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Sensitive Information:</strong> For identity cards containing personal data, we implement additional security measures and process this information only for card production purposes.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section id="how-we-use" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We use your information for the following purposes:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Service Delivery</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Process and manufacture your card orders</li>
                        <li>• Create digital proofs for approval</li>
                        <li>• Manage shipping and delivery</li>
                        <li>• Provide customer support</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Business Operations</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Process payments and invoices</li>
                        <li>• Send order updates and tracking</li>
                        <li>• Improve our services</li>
                        <li>• Ensure quality control</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Legal Compliance</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Comply with legal obligations</li>
                        <li>• Prevent fraudulent activities</li>
                        <li>• Enforce our terms of service</li>
                        <li>• Protect our rights and property</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Respond to inquiries</li>
                        <li>• Send service announcements</li>
                        <li>• Provide order updates</li>
                        <li>• Share important changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Sharing & Disclosure */}
              <section id="data-sharing" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing & Disclosure</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We may share your information with:</p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Service Providers</h4>
                    <ul className="text-yellow-800 text-sm space-y-2">
                      <li>
                        <strong>Payment Processors:</strong> Secure payment gateways for transaction processing
                      </li>
                      <li>
                        <strong>Shipping Partners:</strong> Delivery services for order fulfillment (only shipping address shared)
                      </li>
                      <li>
                        <strong>Cloud Services:</strong> Secure storage providers for design files and data
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">Legal Requirements</h4>
                    <p className="text-red-800 text-sm">
                      We may disclose your information if required by law, court order, or governmental authority. We will notify you of such requests when permitted by law.
                    </p>
                  </div>

                  <p className="text-gray-700">
                    <strong>We do not sell your personal information</strong> to third parties for marketing purposes. Design files and card content are never shared with unauthorized parties.
                  </p>
                </div>
              </section>

              {/* Data Protection */}
              <section id="data-protection" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Protection & Security</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We implement robust security measures to protect your data:</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Technical Measures</h4>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• SSL encryption for data transmission</li>
                        <li>• Secure servers with firewalls</li>
                        <li>• Regular security updates</li>
                        <li>• Access controls and authentication</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Organizational Measures</h4>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• Employee training on data protection</li>
                        <li>• Confidentiality agreements</li>
                        <li>• Regular security audits</li>
                        <li>• Incident response procedures</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Design File Protection:</strong> All uploaded design files are encrypted and stored securely. Files are automatically deleted 30 days after order completion unless otherwise requested.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We retain your information only as long as necessary:</p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">Data Type</th>
                          <th className="px-4 py-2 text-left font-semibold">Retention Period</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2">Account Information</td>
                          <td className="px-4 py-2">3 years after last activity</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Design Files</td>
                          <td className="px-4 py-2">30 days after order completion</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Order History</td>
                          <td className="px-4 py-2">7 years for tax purposes</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Card Content Data</td>
                          <td className="px-4 py-2">Deleted after production verification</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Communication Records</td>
                          <td className="px-4 py-2">2 years after last contact</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
                <div className="space-y-4 text-gray-700">
                  <p>You have the following rights regarding your personal data:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Access & Control</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Access your personal information</li>
                        <li>• Correct inaccurate data</li>
                        <li>• Request data deletion</li>
                        <li>• Object to data processing</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Data Management</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Export your data</li>
                        <li>• Restrict processing</li>
                        <li>• Withdraw consent</li>
                        <li>• Lodge complaints</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      To exercise your rights, contact us. We will respond within 30 days and may require identity verification for security purposes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies & Tracking */}
              <section id="cookies" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies & Tracking Technologies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We use cookies and similar technologies to enhance your experience:</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Session management</li>
                        <li>• Shopping cart functionality</li>
                        <li>• Security features</li>
                        <li>• Load balancing</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Analytical Cookies</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Website usage analysis</li>
                        <li>• Performance monitoring</li>
                        <li>• Feature improvement</li>
                        <li>• User experience optimization</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-gray-700">
                    You can control cookie settings through your browser. However, disabling essential cookies may affect website functionality.
                  </p>
                </div>
              </section>

              {/* Third-Party Services */}
              <section id="third-party" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Services</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Our services may contain links to third-party websites or services:</p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Payment Gateways:</strong> Secure payment processing services
                    </li>
                    <li>
                      <strong>Shipping Carriers:</strong> Delivery and tracking services
                    </li>
                    <li>
                      <strong>Analytics Providers:</strong> Website usage analysis tools
                    </li>
                  </ul>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                      We are not responsible for the privacy practices of third-party services. We encourage you to review their privacy policies before providing any personal information.
                    </p>
                  </div>
                </div>
              </section>

              {/* International Transfers */}
              <section id="international" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p className="text-gray-700">
                  Your data is primarily processed and stored in India. In cases where we use international service providers, we ensure adequate data protection measures through standard contractual clauses and other approved mechanisms.
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{`11. Children's Privacy`}</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children without parental consent.
                  </p>
                  <p>
                    For school ID cards containing student information, we require schools to obtain appropriate parental consent and only process this data for card production purposes.
                  </p>
                </div>
              </section>

              {/* Policy Changes */}
              <section id="changes" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
                <p className="text-gray-700">
                 {`We may update this Privacy Policy periodically. We will notify you of significant changes through email or prominent notices on our website. The "Last updated" date at the top indicates when changes were made.`} 
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have questions about this Privacy Policy or our data practices, contact our Data Protection Officer:
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700">
                    <strong>Card Production Department</strong><br />
                    <strong>Email:</strong> info@identitycards.co.in<br />
                    {/* <strong>Phone:</strong> [Your Contact Number]<br />
                    <strong>Address:</strong> [Your Company Address]<br /> */}
                    <strong>Business Hours:</strong> Mon-Fri, 9AM-6PM  (IST)
                  </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Complaints:</strong> If you are not satisfied with our response, you have the right to lodge a complaint with the relevant data protection authority in your jurisdiction.
                    </p>
                  </div>
                </div>
              </section>

              {/* Acceptance */}
              <div className="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Your Privacy Matters</h3>
                <p className="text-green-800">
                  We are committed to protecting your privacy and ensuring the security of your personal information throughout our card manufacturing process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}