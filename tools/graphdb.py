from langchain.chains import GraphCypherQAChain
from langchain_community.graphs import Neo4jGraph
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import dotenv
import os
import warnings

warnings.filterwarnings("ignore")

dotenv.load_dotenv()

neo4j_password = os.getenv("NEO4JPASS")
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

# Initialize the Cohere LLM
gemini_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# Initialize Neo4j Graph
uri = "neo4j+s://2ee361af.databases.neo4j.io"
user = "neo4j"
password = neo4j_password

graph = Neo4jGraph(
    url=uri,
    username=user,
    password=password
)

prompt_template = """
Given the following schema of a Neo4j graph database related to employees, projects, financial claims, policies, IT assets, and support tickets:

### Nodes:
- Employee (Properties: employee_id, name, role, department, branch, manager_id)
- Department (Properties: name, allocated_amount, spent_amount)
- Claim (Properties: claim_id, amount, status, approval_date)
- Policy (Properties: policy_id, title, category)
- Ticket (Properties: ticket_id, category, status, priority)
- Device (Properties: device_id, type, assigned_to, status)
- Software (Properties: name, version, license_status)
- Staff (Properties: staff_id, name, role)
- Project (Properties: project_id, name, status, department)
- Task (Properties: task_id, title, status, priority)
- Company (Properties: name, industry)

### Relationships:
- (Employee)-[:REPORTS_TO]->(Employee)
- (Employee)-[:WORKS_ON]->(Project)
- (Project)-[:HAS_TASK]->(Task)
- (Task)-[:ASSIGNED_TO]->(Employee)
- (Employee)-[:REQUESTED]->(Claim)
- (Employee)-[:SUBMITTED]->(Claim)
- (Claim)-[:APPROVED_BY]->(Employee)
- (Department)-[:FOLLOWS]->(Policy)
- (Employee)-[:RAISED]->(Ticket)
- (Ticket)-[:RESOLVED_BY]->(Staff)
- (Employee)-[:ASSIGNED]->(Device)
- (Software)-[:LICENSED_TO]->(Department)
- (Department)-[:MANAGES]->(Project)

### Note:
- Financial data such as **claims** should be handled with NULL safety.
- Employees can be **assigned to multiple projects and claims**.
- Policies may apply to **departments**, and **software is licensed per department**.
- **Tickets** are resolved by IT **staff**, not employees.
- Always check **relationships dynamically** before accessing properties.

### User Question: {query}

### Generate a Cypher query that:
1. **Handles NULL values** appropriately using `CASE WHEN ... ELSE` statements.
2. **Includes relevant filtering** based on user input.
3. **Orders results appropriately** for better readability.
4. **Uses LIMIT when needed** to optimize performance.

### Important:
1. Return **only the pure Cypher query** without markdown, SQL, or other formatting.
2. Use **error handling with CASE** for financial amounts.
3. Always use **ORDER BY** and **LIMIT** when applicable.

### Cypher Query:
"""

prompt = PromptTemplate(template=prompt_template, input_variables=["query"])

def generate_cypher_query(user_query):
    """
    Function to generate a Cypher query from user input using a Neo4j schema.
    """
    try:
        chain = GraphCypherQAChain.from_llm(
            llm=gemini_llm,
            graph=graph,
            verbose=True,
            cypher_prompt=prompt,
            return_direct=True,
            allow_dangerous_requests=True
        )

        result = chain.invoke({"query": user_query})

        if isinstance(result, dict):
            return result.get('result', '')
        else:
            return str(result)
    except Exception as e:
        print(f"Error generating Cypher query: {str(e)}")
        return None
