"use client";
import { useState } from "react";
import Link from "next/link";

export default function CancellationRefundPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "cancellation-policy", title: "Cancellation Policy" },
    { id: "refund-policy", title: "Refund Policy" },
    { id: "order-modification", title: "Order Modification" },
    { id: "production-timeline", title: "Production Timeline" },
    { id: "quality-issues", title: "Quality Issues" },
    { id: "shipping-returns", title: "Shipping & Returns" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Clear guidelines for order cancellations and refunds for our card manufacturing services
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
                  This Cancellation & Refund Policy outlines the terms and conditions governing order cancellations, modifications, and refund requests for our identity card, PVC card, and custom card manufacturing services.
                </p>
                <p className="text-gray-700">
                  Due to the custom nature of our products and manufacturing process, we have specific policies to ensure fairness and operational efficiency. Please read this policy carefully before placing your order.
                </p>
              </section>

              {/* Cancellation Policy */}
              <section id="cancellation-policy" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cancellation Policy</h2>
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Full Refund Available</h4>
                    <p className="text-green-800 text-sm">
                      Orders can be cancelled with full refund within <strong>24 hours</strong> of placement, provided production has not begun.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Partial Refund Available</h4>
                    <p className="text-yellow-800 text-sm">
                      After <strong>24 hours</strong> but before <strong>proof approval</strong>, cancellation may incur a 15% processing fee.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">❌ No Cancellation Possible</h4>
                    <p className="text-red-800 text-sm">
                      Once <strong>digital proof is approved</strong> and production begins, orders cannot be cancelled as materials are custom-ordered and manufacturing processes are initiated.
                    </p>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <h4 className="font-semibold text-gray-900">Cancellation Process</h4>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Send cancellation request</li>
                      <li>Include your order number and reason for cancellation</li>
                      <li>We will confirm cancellation eligibility within 24 hours</li>
                      <li>Refunds processed within 5-7 business days</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Refund Policy */}
              <section id="refund-policy" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Policy</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-700 mb-3">Eligible for Full Refund</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Order cancelled within 24 hours
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          We are unable to fulfill your order
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Significant production delay (7+ days)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Manufacturing defect (see Quality Issues)
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-700 mb-3">Not Eligible for Refund</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          After proof approval
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Change of mind after production
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Design errors in provided artwork
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Color variations from digital proofs
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Refund Processing</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Refunds processed within 5-7 business days</li>
                      <li>• Refund method same as original payment</li>
                      <li>• Bank transfer refunds may take 7-10 business days</li>
                      <li>• Transaction fees non-refundable</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Order Modification */}
              <section id="order-modification" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Order Modification</h2>
                <div className="space-y-4 text-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Modification Type</th>
                          <th className="px-4 py-3 text-left font-semibold">When Possible</th>
                          <th className="px-4 py-3 text-left font-semibold">Charges</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3">Quantity Change</td>
                          <td className="px-4 py-3">Before proof approval</td>
                          <td className="px-4 py-3">No charge</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Shipping Address</td>
                          <td className="px-4 py-3">Before shipment</td>
                          <td className="px-4 py-3">No charge</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Design Changes</td>
                          <td className="px-4 py-3">Before proof approval</td>
                          <td className="px-4 py-3">No charge</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Card Material/Specs</td>
                          <td className="px-4 py-3">Before proof approval</td>
                          <td className="px-4 py-3">Price difference</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Rush Production</td>
                          <td className="px-4 py-3">Before production start</td>
                          <td className="px-4 py-3">Rush fee applicable</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Important:</strong> Once digital proof is approved, no modifications can be made to design, quantity, or specifications as production materials are custom-ordered.
                    </p>
                  </div>
                </div>
              </section>

              {/* Production Timeline */}
              <section id="production-timeline" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Production Timeline & Impact</h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Standard Production Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">Order Placement & File Upload</span>
                        <span className="text-blue-600 font-semibold">Day 1</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">Digital Proof Creation</span>
                        <span className="text-blue-600 font-semibold">1-2 Business Days</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">Proof Approval by Customer</span>
                        <span className="text-green-600 font-semibold">Production Lock</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium">Production & Manufacturing</span>
                        <span className="text-blue-600 font-semibold">3-5 Business Days</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="font-medium">Quality Check & Shipping</span>
                        <span className="text-blue-600 font-semibold">1-2 Business Days</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700">
                    <strong>Total Timeline:</strong> 5-10 business days for standard orders. Rush production available at additional cost.
                  </p>
                </div>
              </section>

              {/* Quality Issues */}
              <section id="quality-issues" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Quality Issues & Manufacturing Defects</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We stand behind the quality of our products. If you receive cards with manufacturing defects, we will replace them at no cost.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Covered by Warranty</h4>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• Misprinted cards (our error)</li>
                        <li>• Damaged cards during production</li>
                        <li>• Incorrect card specifications</li>
                        <li>• Material defects</li>
                        <li>• Poor print quality</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Not Covered</h4>
                      <ul className="text-red-800 text-sm space-y-1">
                        <li>• Design errors in provided artwork</li>
                        <li>• Color variations from digital proof</li>
                        <li>• Minor printing imperfections</li>
                        <li>• Damage during customer use</li>
                        <li>• Normal wear and tear</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Quality Claim Process</h4>
                    <ol className="text-blue-800 text-sm space-y-2">
                      <li>1. Notify us within 7 days of receipt</li>
                      <li>2. Provide clear photos of defective cards</li>
                      <li>3. Include your order number and details</li>
                      <li>4. We will review and respond within 48 hours</li>
                      <li>5. If approved, replacement cards shipped free</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Shipping & Returns */}
              <section id="shipping-returns" className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Shipping & Returns</h2>
                <div className="space-y-4 text-gray-700">
                  <h4 className="font-semibold text-gray-900">Shipping Policy</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Standard shipping: 2-7 business days</li>
                    <li>Express shipping available at additional cost</li>
                    <li>International shipping rates calculated at checkout</li>
                    <li>Tracking information provided for all orders</li>
                  </ul>

                  <h4 className="font-semibold text-gray-900 mt-4">Return Policy</h4>
                  <p>
                    Due to the custom nature of our products, we do not accept returns for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Correctly manufactured cards</li>
                    <li>Change of mind or design preference</li>
                    <li>Cards matching approved digital proof</li>
                    <li>Bulk orders with minor color variations</li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Lost/Damaged Shipments:</strong> If your order is lost or damaged during transit, contact us immediately. We will work with the shipping carrier to resolve the issue and reship your order if necessary.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    For cancellation requests, refund inquiries, or quality issues, contact our customer service team:
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700">
                      <strong>Customer Service Department</strong><br />
                      <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700">
                    <strong>Card Production Department</strong><br />
                    <strong>Email:</strong> info@identitycards.co.in<br />
                    {/* <strong>Phone:</strong> [Your Contact Number]<br />
                    <strong>Address:</strong> [Your Company Address]<br /> */}
                    <strong>Business Hours:</strong> Mon-Fri, 9AM-6PM (IST)
                  </p>
                  </div>
                      <strong>Response Time:</strong> Within 24 hours
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Quick Resolution:</strong> When contacting about cancellations or refunds, please include your order number, reason for request, and any relevant photos or documents for faster processing.
                    </p>
                  </div>
                </div>
              </section>

              {/* Summary */}
              <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Policy Summary</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-blue-800 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">You Can Cancel/Refund When:</h4>
                    <ul className="space-y-1">
                      <li>• Within 24 hours of order</li>
                      <li>• Before proof approval</li>
                      <li>• Manufacturing defects</li>
                      <li>• We cannot fulfill order</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">You Cannot Cancel/Refund When:</h4>
                    <ul className="space-y-1">
                      <li>• After proof approval</li>
                      <li>• Production has started</li>
                      <li>• Design errors in your file</li>
                      <li>• Change of mind</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}