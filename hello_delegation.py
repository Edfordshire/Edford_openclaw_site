"""
hello_delegation.py - Simple greeting script with timestamp.
"""

from datetime import datetime


def main():
    timestamp = datetime.now().isoformat(sep=" ", timespec="seconds")
    print(f"Hello from Coder!")
    print(f"Current timestamp: {timestamp}")


if __name__ == "__main__":
    main()
