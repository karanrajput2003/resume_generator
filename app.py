import sys
import json
import requests

api_endpoint = 'https://nubela.co/proxycurl/api/v2/linkedin'
# linkedin_profile_url = 'https://www.linkedin.com/in/karan-rajput-19b93b26b'
linkedin_profile_url = 'https://www.linkedin.com/in/karan-rajput-5a07a5270'
api_key = '2GGDDiGm0TydqbsfFXmslw'
header_dic = {'Authorization': 'Bearer ' + api_key}

r = requests.get(api_endpoint,
                        params={'url': linkedin_profile_url, 'skills': 'include'},
                        headers=header_dic)

data = r.json()

resp = {
    "Response":200,
    "Message":"Data from Python",
    "Data":data
}

print(json.dumps(resp))
sys.stdout.flush()

