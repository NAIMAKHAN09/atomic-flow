#!/usr/bin/env python3
"""
Atomic Flow Habit Tracker Backend API Testing
Tests all backend functionality including auth, habits, and analytics
"""

import requests
import sys
import json
from datetime import datetime

# Configuration
BACKEND_URL = "https://habit-tracker-app-60.preview.emergentagent.com"
SESSION_TOKEN = "test_session_1771945809713"  # From mongosh test user creation

class AtomicFlowAPITester:
    def __init__(self, base_url=BACKEND_URL, session_token=SESSION_TOKEN):
        self.base_url = base_url
        self.session_token = session_token
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.created_habit_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, json_data=None):
        """Run a single API test with proper error handling"""
        url = f"{self.base_url}/{endpoint}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.session_token}'
        }

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                payload = json_data if json_data else data
                response = requests.post(url, json=payload, headers=headers, timeout=10)
            elif method == 'PUT':
                payload = json_data if json_data else data
                response = requests.put(url, json=payload, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False, {}

        except requests.RequestException as e:
            self.failed_tests.append({
                'name': name,
                'error': f"Request failed: {str(e)}"
            })
            print(f"❌ FAILED - Network Error: {str(e)}")
            return False, {}

    def test_auth_me(self):
        """Test authentication endpoint"""
        success, response = self.run_test(
            "Auth /me endpoint",
            "GET",
            "api/auth/me",
            200
        )
        return success

    def test_create_habit(self):
        """Test creating a new habit with atomic habits framework"""
        habit_data = {
            "name": "Morning Exercise",
            "description": "30 minutes of cardio exercise",
            "category": "health",
            "cue": "When I wake up and put on workout clothes",
            "craving": "I want to feel energized and strong",
            "response": "Do 30 minutes of cardio exercise",
            "reward": "I feel accomplished and track my progress",
            "color": "#4F772D",
            "goal_frequency": 1
        }
        
        success, response = self.run_test(
            "Create habit with atomic framework",
            "POST",
            "api/habits",
            200,
            json_data=habit_data
        )
        
        if success and 'habit_id' in response:
            self.created_habit_id = response['habit_id']
            print(f"   Created habit ID: {self.created_habit_id}")
            
            # Verify atomic habits fields
            required_fields = ['name', 'category', 'cue', 'craving', 'response', 'reward']
            missing_fields = [f for f in required_fields if f not in response or not response[f]]
            if missing_fields:
                print(f"   ⚠️  Missing atomic habits fields: {missing_fields}")
                return False
                
        return success

    def test_get_habits(self):
        """Test fetching all habits for user"""
        success, response = self.run_test(
            "Get all habits",
            "GET",
            "api/habits",
            200
        )
        
        if success:
            print(f"   Found {len(response)} habits")
            if len(response) > 0:
                habit = response[0]
                # Check for atomic habits framework fields
                framework_fields = ['cue', 'craving', 'response', 'reward']
                present_fields = [f for f in framework_fields if f in habit and habit[f]]
                print(f"   Atomic framework fields present: {present_fields}")
        
        return success

    def test_log_habit(self):
        """Test logging a habit completion"""
        if not self.created_habit_id:
            print("   ❌ No habit ID available for logging test")
            return False
            
        success, response = self.run_test(
            "Log habit completion",
            "POST",
            f"api/habits/{self.created_habit_id}/log",
            200,
            json_data={"notes": "Completed morning run!"}
        )
        
        if success and 'log_id' in response:
            print(f"   Created log ID: {response['log_id']}")
        
        return success

    def test_analytics_overview(self):
        """Test analytics overview endpoint"""
        success, response = self.run_test(
            "Analytics overview",
            "GET",
            "api/analytics/overview",
            200
        )
        
        if success:
            expected_fields = ['total_habits', 'completed_today', 'current_streak', 'total_completions']
            present_fields = [f for f in expected_fields if f in response]
            print(f"   Analytics fields: {present_fields}")
            
            if len(present_fields) != len(expected_fields):
                missing = [f for f in expected_fields if f not in response]
                print(f"   ⚠️  Missing analytics fields: {missing}")
        
        return success

    def test_analytics_streaks(self):
        """Test habit streaks analytics"""
        success, response = self.run_test(
            "Analytics streaks",
            "GET",
            "api/analytics/streaks",
            200
        )
        
        if success:
            print(f"   Found {len(response)} habit streaks")
            if len(response) > 0:
                streak = response[0]
                expected_fields = ['habit_id', 'habit_name', 'current_streak', 'total_completions']
                present_fields = [f for f in expected_fields if f in streak]
                print(f"   Streak fields: {present_fields}")
        
        return success

    def test_update_habit(self):
        """Test updating a habit"""
        if not self.created_habit_id:
            print("   ❌ No habit ID available for update test")
            return False
            
        update_data = {
            "description": "Updated: 45 minutes of cardio exercise",
            "cue": "Updated: When I wake up at 6 AM"
        }
        
        success, response = self.run_test(
            "Update habit",
            "PUT",
            f"api/habits/{self.created_habit_id}",
            200,
            json_data=update_data
        )
        
        if success:
            if response.get('description') == update_data['description']:
                print("   ✅ Description updated correctly")
            if response.get('cue') == update_data['cue']:
                print("   ✅ Cue updated correctly")
        
        return success

    def test_delete_habit(self):
        """Test deleting a habit"""
        if not self.created_habit_id:
            print("   ❌ No habit ID available for delete test")
            return False
            
        success, response = self.run_test(
            "Delete habit",
            "DELETE",
            f"api/habits/{self.created_habit_id}",
            200
        )
        
        return success

    def run_all_tests(self):
        """Run comprehensive backend API tests"""
        print("=" * 60)
        print("🧪 ATOMIC FLOW BACKEND API TESTING")
        print("=" * 60)
        
        # Authentication tests
        print("\n📋 AUTHENTICATION TESTS")
        self.test_auth_me()
        
        # Habit management tests
        print("\n📋 HABIT MANAGEMENT TESTS")
        self.test_create_habit()
        self.test_get_habits()
        self.test_log_habit()
        self.test_update_habit()
        
        # Analytics tests  
        print("\n📋 ANALYTICS TESTS")
        self.test_analytics_overview()
        self.test_analytics_streaks()
        
        # Cleanup tests
        print("\n📋 CLEANUP TESTS")
        self.test_delete_habit()
        
        # Summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"{i}. {test['name']}")
                if 'expected' in test:
                    print(f"   Expected: {test['expected']}, Got: {test['actual']}")
                if 'error' in test:
                    print(f"   Error: {test['error']}")
                if 'response' in test:
                    print(f"   Response: {test['response']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = AtomicFlowAPITester()
    
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Session Token: {SESSION_TOKEN[:20]}...")
    
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())