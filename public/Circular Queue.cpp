#include <iostream>
using namespace std;
# define j 5;
int cqueue[5];
int front = -1, rear = -1, n=5;

void insertCQ(int val) {
   if ((front == 0 && rear == n-1) || (front == rear+1)) {
      cout<<"Queue Full \n";
      return;
   }
   if (front == -1) {
      front = 0;
      rear = 0;
   } else {
      if (rear == n - 1)
      rear = 0;
      else
      rear = rear + 1;
   }
   cqueue[rear] = val ;
}
void deleteCQ() {
   if (front == -1) {
      cout<<"Queue Empty\n";
      return ;
   }
   cout<<"Element deleted from queue is : "<<cqueue[front]<<endl;

   if (front == rear) {
      front = -1;
      rear = -1;
   } else {
      if (front == n - 1)
      front = 0;
      else
      front = front + 1;
   }
}
void displayCQ() {
   int f = front, r = rear;
   if (front == -1) {
      cout<<"Queue is Empty"<<endl;
      return;
   }
   cout<<"Queue elements are :\n";
   if (f <= r) {
      while (f <= r){
         cout<<cqueue[f]<<" ";
         f++;
      }
   } else {
      while (f <= n - 1) {
         cout<<cqueue[f]<<" ";
         f++;
      }
      f = 0;
      while (f <= r) {
         cout<<cqueue[f]<<" ";
         f++;
      }
   }
   cout<<endl;
}
int main() {

   // // displaying elements in queue
   // displayCQ();

   // // inserting elements in queue
   // insertCQ(12); 
   // insertCQ(1); 
   // insertCQ(9);
   // insertCQ(88);
   // insertCQ(65);

   // // deleting elements in queue
   // deleteCQ();
   // deleteCQ();

   // // displaying elements in queue
   // displayCQ();

   // // inserting elements in queue
   // insertCQ(55);
   // insertCQ(47);
   // insertCQ(7);

   // // displaying elements in queue
   // displayCQ();

   cout << j;   

   return 0;
}
