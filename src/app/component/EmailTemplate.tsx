import { dateFormatter } from "@/utils/data_types";
import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Heading
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

interface EmailTemplateProps {
  $id: string;
  customer_id: string;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  date: string;
  valid_until: string;
  quote: string;
  description_of_work: string;
  items_description: string[];
  items_quantity: number[];
  items_unit: number[];
  items_amount: number[];
  currentUser: {
    email: string;
    phone: string;
    name: string;
  };
}

export const EmailTemplate = ({
  $id,
  customer_id,
  name,
  phone_number,
  email,
  address,
  date,
  valid_until,
  quote,
  description_of_work,
  items_description,
  items_quantity,
  items_unit,
  items_amount,
  currentUser,
}: EmailTemplateProps) => {
  console.log(currentUser && currentUser?.email)
  const currentYear = new Date().getFullYear();
  return (
    <Html>
      <Head />
      <Preview>Meek Elite Cleaning Services Quote</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row>
              <Column>
                <Img
                  src='https://res.cloudinary.com/df3swmzfp/image/upload/v1724208099/Logo_ns59li.png'
                  width="160"
                  height="160"
                  alt="MeekElite Logo"
                />
              </Column>
              <Column>
                <Heading style={h1}>MEEK ELITE CLEANING SERVICES</Heading>
              </Column>
            </Row>
          </Section>

          <Section>
            <Row>
              <Column>
                <Text style={resetText}>F.C.T ABUJA</Text>
                <Text style={resetText}>{currentUser?.phone}</Text>
                <Text style={resetText}>meekelitecleaningservices@gmail.com</Text>
              </Column>
              <Column align="right">
                <Heading style={h2}>QUOTATION</Heading>
                <Section>
                  <Row>
                    <Column style={quoteHead}>
                      <Text style={quotationHead}>QUOTE</Text>
                    </Column>
                    <Column style={quoteHead}>
                      <Text style={quotationHead}>DATE</Text>
                    </Column>
                  </Row>
                </Section>
                <Section>
                  <Row>
                    <Column style={quoteSubHead}>
                    <Text style={quoteText}>{quote}</Text>
                    </Column>
                    <Column style={quoteSubHead}>
                    <Text style={quoteText}>{dateFormatter(date)}</Text>
                    </Column>
                  </Row>
                </Section>

                <Section>
                  <Row>
                    <Column style={quoteHead}>
                      <Text style={quotationHead}>CUSTOMER ID</Text>
                    </Column>
                    <Column style={quoteHead}>
                      <Text style={quotationHead}>VALID UNTIL</Text>
                    </Column>
                  </Row>
                </Section>
                <Section>
                  <Row>
                    <Column style={quoteSubHead}>
                      <Text style={quoteText} >{customer_id}</Text>
                    </Column>
                    <Column style={quoteSubHead}>
                    <Text style={quoteText}>{dateFormatter(valid_until)}</Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>

          <Section>
            <Column style={quoteHead}>
              <Text style={{ borderSpacing: "0px", color: "#ffff", backgroundColor: "#019CDE", borderRadius: "3px", fontSize: "12px", fontWeight: "700", width: "20%"}}>COMPANY/NAME</Text>
            </Column>
          </Section>

          <Section style={{ marginBottom: "5%"}}>
            <Column style={tableCell}>
              <Text style={resetText}>{name}</Text>
              <Text style={resetText}>{address}</Text>
              <Text style={resetText}>{phone_number}</Text>
            </Column>
          </Section>

          <Section style={productTitleTable}>
            <Text style={productsTitle}>DESCRIPTION OF WORK</Text>
          </Section>

          <Section style={{ borderBottom: "2px solid #e5e5e5", borderLeft: "2px solid #e5e5e5", borderRight: "2px solid #e5e5e5", marginBottom: "5%", padding: "1%"}}>
            <Text style={productDescription}>{description_of_work}</Text>
          </Section>

          <Section style={productTitleTable}>
            <Row>
              <Column style={{...productTitleHeader, width: "25%"}}>
                <Text style={productsTitle}>ITEM</Text>
              </Column>
              <Column style={{...productTitleHeader, width: "25%"}}>
                <Text style={productsTitle}>QTY</Text>
              </Column>
              <Column style={{...productTitleHeader, width: "25%"}}>
                <Text style={productsTitle}>UNIT PRICE</Text>
              </Column>
              <Column style={{...productTitleHeader, width: "25%"}}>
                <Text style={productsTitle}>AMOUNT</Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ borderBottom: "2px solid #e5e5e5", borderLeft: "2px solid #e5e5e5", borderRight: "2px solid #e5e5e5",  padding: "1%"}}>
            <Row style={itemRow}>
              <Column style={{ width: "27%" }}>
                {items_description?.map((data, index) => (
                  <Text key={index} style={productDescription}>
                    {data}
                    <br />
                  </Text>
                ))}
              </Column>
              <Column style={{ width: "27%" }}>
                {items_quantity?.map((data, index) => (
                  <Text key={index} style={productDescription}>
                    {data}
                    <br />
                  </Text>
                ))}
              </Column>
              <Column style={{ width: "25%" }}>
                {items_unit?.map((data, index) => (
                  <Text key={index} style={productDescription}>
                    {data}
                    <br />
                  </Text>
                ))}
              </Column>
              <Column style={{ width: "25%" }}>
                {items_amount?.map((data, index) => (
                  <Text key={index} style={productDescription}>
                    {Number.isInteger(data) ? data.toFixed(2) : data}
                    <br />
                  </Text>
                ))}
              </Column>
            </Row>
            <Section style={{ border: "2px solid #e5e5e5", padding: "1%" }}>
              <Row>
                <Column>
                  <Text style={productPriceLarge}>TOTAL</Text>
                </Column>
                <Column align="right">
                  <Text style={productPriceLarge}>
                    ₦
                    {items_amount.reduce((total, amount) => {
                      return total + amount;
                    }, 0).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>
          </Section>

          <Section>
            <Row>
              <Column style={quoteHead}>
                <Text style={{ borderSpacing: "0px", color: "#ffff", backgroundColor: "#019CDE", borderRadius: "3px", fontSize: "12px", fontWeight: "700", width: "40%", padding: "2% 0", marginRight: "380px"}}>TERMS AND CONDITION</Text>
              </Column>
              <Column style={{ borderBottom: "2px solid #e5e5e5", borderLeft: "2px solid #e5e5e5", borderRight: "2px solid #e5e5e5", display: "flex",  padding: "15px", width: "80%", }}>
                <Text style={productPriceLarge}>SUBTOTAL</Text>
                <Text style={productPriceLarge}>
                  ₦
                  {items_amount.reduce((total, amount) => {
                    return total + amount;
                  }, 0).toFixed(2)}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginBottom: "5%"}}>
            <Column style={tableCell}>
              <Text style={{...resetText, fontWeight: "bold"}}>This quote is valid for 10Days.</Text>
              <Text style={{...resetText, fontWeight: "bold"}}>Additional charges may apply.</Text>
              <Text style={{...resetText, fontWeight: "bold"}}>Deposit 50% payment on acceptance of this quote</Text>
            </Column>
          </Section>


          <Section style={{ border: "2px solid #e5e5e5", padding: "1%", marginBottom: "1%" }}>
            <Row>
              <Column>
                <Text style={{...resetText, fontWeight: "bold"}}>Quotation prepared by:</Text>
              </Column>
              <Column align="right">
                <Text style={{...resetText, fontWeight: "bold"}}>{currentUser?.name}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ border: "2px solid #e5e5e5", padding: "1%" }}>
            <Row>
              <Column>
                <Text style={{...resetText, fontWeight: "bold"}}>Quotation accepted by:</Text>
              </Column>
              <Column align="right">
                <Text style={{...resetText, fontWeight: "bold"}}>
                  
                </Text>
              </Column>
            </Row>
          </Section>


          <Section>
            <Text style={footerText}>
              If you have any questions, please feel free to contact us. We look forward to working with you!
            </Text>
            <Text style={footerText}>
              Sincerely,
              <br />
              MeekElite Cleaning Services Team
            </Text>
          </Section>

          <Section>
            <Row>
              <Column align="center" style={footerIcon}>
                <Img
                  src='https://res.cloudinary.com/df3swmzfp/image/upload/v1724208099/Logo_ns59li.png'
                  width="66"
                  height="66"
                  alt="MeekElite Logo"
                />
              </Column>
            </Row>
          </Section>

          <Text style={footerCopyright}>
            Copyright © {currentYear} MeekElite Cleaning Services. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailTemplate;

const main = {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  backgroundColor: "#ffffff",
};

const h1 = {
  color: "#019CDE",
  fontSize: "1.6rem",
  fontWeight: "600",
};

const h2 = {
  color: "#000",
  fontSize: "1.6rem",
  fontWeight: "600",
};

const displayFlex = {
  display: "flex",
  border: "1px solid red"
}

const resetText = {
  margin: "5px 0",
  padding: "0",
};

const container = {
  margin: "0 auto",
  padding: "10px 0 28px",
  width: "780px",
  maxWidth: "100%",
};

const tableCell = { display: "table-cell" };

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "#ffff",
  backgroundColor: "#019CDE",
  borderRadius: "3px",
  fontSize: "13px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "#666666",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "13px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "0",
  height: "24px",
};

const quotationHead = {
  borderSpacing: "0px",
  color: "#ffff",
  backgroundColor: "#019CDE",
  borderRadius: "3px",
  fontSize: "13px",
  fontWeight: "700",
  margin: "0 2%",
  width: "90%"
};

const productsTitle = {
  background: "#019CDE",
  paddingLeft: "10px",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0",
  color: "#fff"
};

const productTitleHeader = {
  padding: "5px",
  borderBottom: "1px solid #e5e5e5",
  textAlign: "left" as const,
};

const quoteHead = {
  textAlign: "center" as const,
};

const quoteSubHead = {
  textAlign: "center" as const,
  padding: "0",
  width: "30%"
}

const quoteText = {
  textAlign: "center" as const,
  fontSize: "13px",
  color: "#000",
};

const itemRow = {
  padding: "10px 0",
};


const productTitle = { fontSize: "13px", fontWeight: "600", ...resetText };

const productDescription = {
  fontSize: "13px",
  color: "#000",
  ...resetText,
  
};

const productPrice = {
  fontSize: "13px",
  color: "#019CDE",
  ...resetText,
};

const productPriceLargeWrapper = { padding: "10px 20px 0px 0px" };

const productPriceVerticalLine = {
  borderLeft: "1px solid #e5e5e5",
  height: "100%",
};

const productPriceLarge = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#019CDE",
  margin: "0 0 0 10px",
  padding: "0",
};

const productPriceTotal = {
  fontSize: "12px",
  fontWeight: "500",
  color: "#019CDE",
  margin: "0",
};

const productPriceLine = {
  margin: "0 0 20px 0",
  borderBottom: "2px solid #e5e5e5",
  borderLeft: "2px solid #e5e5e5", 
  borderRight: "2px solid #e5e5e5"
};

const productPriceLineBottom = {
  margin: "20px 0 0 0",
  borderBottom: "1px solid #e5e5e5",
};

const footerText = {
  fontSize: "12px",
  color: "#666666",
  lineHeight: "1.4",
  marginTop: "20px",
};

const footerIcon = { paddingTop: "10px" };

const footerCopyright = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
  marginTop: "20px",
};
