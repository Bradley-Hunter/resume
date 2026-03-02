export const listProgramFiles = [
  { name: 'Main.java', language: 'java', group: 'Java', code: `import java.util.*;
import java.io.*;

public class Main {
    private MainMenu mainMenu;
    private AddMenu addMenu;
    private ViewMenu viewMenu;
    private static Main m;
    static Scanner scan = new Scanner(System.in);
    private static HashMap<String, ArrayList<String>> listOfLists;

    public static void main(String[] args) throws ClassNotFoundException{
        m = new Main();
        m.mainMenu = new MainMenu();
        m.viewMenu = new ViewMenu();
        m.addMenu = new AddMenu();
        boolean done = false;
        m.GetListFromFile(m.GetFilename());
        while (!done)
        {
            m.mainMenu.DisplayMenu(m.mainMenu.GetMenu());
            String option = GetCurrentOption();
            // System.out.println(option);
            done = RunMainMenu(option);
        }
        m.SaveListToFile(m.GetFilename());
    }

    private void SaveListToFile(String filename){
        try {
            FileOutputStream fileOut = new FileOutputStream(filename);
            ObjectOutputStream objOut = new ObjectOutputStream(fileOut);
            objOut.writeObject(listOfLists);
            objOut.close();

            fileOut.close();
            System.out.println("Successfully wrote to the file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
            // e.printStackTrace();
        }
    }
    private String GetFilename(){
        System.out.print("What file do you want to open from/save to? ");
        return scan.nextLine();
    }

    private void GetListFromFile(String filename) throws ClassNotFoundException{
        try {
            FileInputStream fileIn = new FileInputStream(filename);
            ObjectInputStream objectIn = new ObjectInputStream(fileIn);
            listOfLists = (HashMap<String, ArrayList<String>>) objectIn.readObject();
            objectIn.close();
            fileIn.close();
        } catch (FileNotFoundException e) {
            listOfLists = new HashMap<String, ArrayList<String>>();
            System.out.println("File not found. Starting a new set of lists");
            // e.printStackTrace();
        } catch (IOException e) {
            System.out.println("An error occurred.");
            // e.printStackTrace();
        }
    }

    private static String GetCurrentOption(){
        System.out.print("\\nWhat is your choice? ");
        String option = scan.nextLine();
        // System.out.println("What is your choice> ");
        return option;
    }

    private static boolean RunMainMenu(String option){
        if (option.equals("1")){
            AddList();
        }
        else if (option.equals("2")){
            ViewList();
        }
        else if (option.equals("3")){
            DeleteList();
        }
        else if (option.equals("4")){
        //     SaveList();
            return true;
        }
        return false;
    }

    private static void DeleteList(){
        DisplayListofLists();
        System.out.println("Which list should be deleted?");
        String option = GetCurrentOption();
        System.out.println("\\nAre you sure you want to delete the list? ");
        String option2 = scan.nextLine();
        // System.out.println("Are you sure you want to delete the list> ");
        if (option2.toLowerCase().equals("yes")){
            listOfLists.remove(option);
        }
    }

    private static void DisplayListofLists(){
        System.out.println("\\nList of Lists:");
        int count = 1;
        for (String key : listOfLists.keySet()) {
            System.out.println(count + ". " + key);
            count++;
        }
    }

    private static void ViewList(){
        DisplayListofLists();
        int quitSpot = listOfLists.size() + 1;
        System.out.println(quitSpot + ". Quit");
        boolean correctOption = false;
        String name = GetCurrentOption();
        boolean firstRun = true;
        while (!correctOption){
            if (!firstRun)
            {
                name = GetCurrentOption();
            }
            if (listOfLists.containsKey(name))
            {
                DisplayCurrentList(name);
                correctOption = true;
            }
            else if (name.toLowerCase().equals("quit"))
            {
                return;
            }
            else
            {
                System.out.println("\\nInvalid option.\\n");
            }
            firstRun = false;
        }
        firstRun = true;
        boolean done = false;
        while (!done){
            if (!firstRun)
            {
                DisplayCurrentList(name);
            }
            else{
                firstRun = false;
            }
            m.viewMenu.DisplayMenu(m.viewMenu.GetMenu());
            String option = GetCurrentOption();
            done = RunViewMenu(name, option);
        }
    }

    private static boolean RunViewMenu(String name, String option){
        if (option.equals("1"))
        {
            AddItem(name);
        }
        else if (option.equals("2"))
        {
            RemoveItem(name);
        }
        else
        {
            return true;
        }
        return false;
    }

    private static void RemoveItem(String name){
        System.out.println("Which item should be removed?");
        String item = GetCurrentOption();
        listOfLists.get(name).remove(item);
        System.out.println("\\nRemoved " + item + " from " + name + ".");
    }

    private static void AddList(){
        System.out.print("\\nWhat is the list name? ");
        String name = scan.nextLine();
        if (listOfLists.containsKey(name)){
            System.out.println("List already exists");
            return;
        }
        listOfLists.put(name, new ArrayList<String>());
        boolean done = false;
        while (!done)
        {
            DisplayCurrentList(name);
            m.addMenu.DisplayMenu(m.addMenu.GetMenu());
            String option = GetCurrentOption();
            done = RunAddMenu(name, option);
        }
    }

    private static void DisplayCurrentList(String name){
        System.out.println("\\nCurrent contents of " + name + ":");
        int count = 1;
        for (String string : listOfLists.get(name)){
            System.out.println(count + ". " + string);
            count++;
        }
    }

    private static boolean RunAddMenu(String name, String option){
        if (option.equals("1"))
        {
            AddItem(name);
        }
        else if (option.equals("2"))
        {
            return true;
        }
        return false;
    }

    private static void AddItem(String name){
        System.out.print("\\nWhat do you want to add to " + name + "?");
        String item = scan.nextLine();
        listOfLists.get(name).add(item);
    }
}` },
  { name: 'MainMenu.java', language: 'java', group: 'Java', code: `public class MainMenu {
    private String[] menu = {"\\n", "Main Menu", "--------------", "1. Add List", "2. View List", "3. Delete List", "4. Quit/Save"};

    public MainMenu(){

    }

    public void DisplayMenu(String[] menu){
        for (String string : menu) {
            System.out.println(string);
        }
    }

    public String[] GetMenu(){
        return menu;
    }
}` },
  { name: 'ViewMenu.java', language: 'java', group: 'Java', code: `public class ViewMenu extends MainMenu{
    private String[] menu = {"\\n","List Options", "--------------", "1. Add Item", "2. Remove Item", "3. Quit"};

    public ViewMenu(){

    }

    public String[] GetMenu(){
        return menu;
    }
}` },
  { name: 'AddMenu.java', language: 'java', group: 'Java', code: `public class AddMenu extends MainMenu{
    private String[] menu = {"\\n","Add List Menu", "--------------", "1. Add Item", "2. Quit"};

    public AddMenu(){

    }

    public String[] GetMenu(){
        return menu;
    }

}` },
  { name: 'main.cpp', language: 'cpp', group: 'C++', code: `#include "json.hpp"
#include <fstream>
#include <unordered_map>
#include "Menu.h"

using namespace nlohmann;

//unordered_map< string, vector<string>> listOfLists;?
string getFilename();

void getListFromFile(const string &filename);

string getCurrentOption();

bool runMainMenu(const string &option);

void saveListToFile(const string &filename);

void deleteList();

void viewList();

bool runViewMenu(const string &name, const string &option);

void removeItem(const string &name);

void displayListOfLists();

void addList();

void displayCurrentList(const string &name);

bool runAddMenu(const string &name, const string &option);

void addItem(const string &name);

json listOfLists;
Menu mainMenu = *new Menu(vector<string>(
      {"\\n", "Main Menu", "--------------", "1. Add List", "2. View List", "3. Delete List", "4. Quit/Save"}));
Menu addMenu = *new Menu(vector<string>({"\\n", "Add List Menu", "--------------", "1. Add Item", "2. Quit"}));
Menu viewMenu = *new Menu(
      vector<string>({"\\n", "List Options", "--------------", "1. Add Item", "2. Remove Item", "3. Quit"}));

int main()
{
   bool done = false;
   getListFromFile(getFilename());
//    cout << listOfLists << endl;
   while (!done)
   {
      mainMenu.DisplayMenu();
      string option = getCurrentOption();
      done = runMainMenu(option);
   }
   saveListToFile(getFilename());
   return 0;
}

void saveListToFile(const string &filename)
{
   try
   {
      ofstream file(filename, ios_base::out);
      file << setw(4) << listOfLists << endl;
      file.close();
   }
   catch (...)
   {
      cout << "Error occurred in uploading lists to file: " << filename << ".";
   }
}

string getFilename()
{
   string filename;
   cout << "What file do you want to open from/save to?" << endl;
   cin >> filename;
   return filename;
}

void getListFromFile(const string &filename)
{
   try
   {
      ifstream file(filename);
      listOfLists = json::parse(file);
      file.close();
   }
   catch (...)
   {
      cout << "File doesn't exist working from blank." << endl;
   }
}

string getCurrentOption()
{
   bool done = false;
   string option;
   while (!done)
   {
      cout << "\\nWhat is your choice?" << endl;
      getline(cin, option);
      if (option != "")
      {
         done = true;
      }
      else
      {
         cout << "Not a valid option";
      }
   }
   return option;
}

bool runMainMenu(const string &option)
{
   if (option == "1")
   {
      addList();
   }
   else if (option == "2")
   {
      viewList();
   }
   else if (option == "3")
   {
      deleteList();
   }
   else if (option == "4")
   {
      return true;
   }
   return false;
}

void deleteList()
{
   displayListOfLists();
   string option;
   cout << "Which list should be deleted?" << endl;
   cin >> option;
   cout << "Are you sure you want to delete the list? (y/n) ";
   string check;
   cin >> check;
   if (check == "y")
   {
      listOfLists.erase(option);
   }
}

void displayListOfLists()
{
   cout << "\\nList of Lists:" << endl;
   int count = 1;
   for (auto &it: listOfLists.items())
   {
      cout << count << ". " << it.key() << endl;
      count++;
   }
}

void viewList()
{
   displayListOfLists();
   int quitSpot = listOfLists.size() + 1;
   cout << quitSpot << ". quit" << endl;
   bool validOption = false;
   string name = getCurrentOption();
   bool firstRun = true;
   while (!validOption)
   {
      if (!firstRun)
      {
         name = getCurrentOption();
      }
      if (listOfLists.contains(name))
      {
         displayCurrentList(name);
         validOption = true;
      }
      else if (name == "quit")
      {
         return;
      }
      else
      {
         cout << "\\nInvalid Option.\\n";
      }
      firstRun = false;
   }
   firstRun = true;
   bool done = false;
   while (!done)
   {
      if (!firstRun)
      {
         displayCurrentList(name);
      }
      else
      {
         firstRun = false;
      }
      viewMenu.DisplayMenu();
      string option = getCurrentOption();
      done = runViewMenu(name, option);
   }
}

bool runViewMenu(const string &name, const string &option)
{
   if (option == "1")
   {
      addItem(name);
   }
   else if (option == "2")
   {
      removeItem(name);
   }
   else
   {
      return true;
   }
   return false;
}

void removeItem(const string &name)
{
   cout << "What item should be removed?";
   string item = getCurrentOption();
   for (auto i = 0; i < listOfLists[name].size(); i++)
   {
      if (listOfLists[name][i] == item)
      {
         listOfLists[name].erase(i);
      }
   }
}

void addList()
{
   cout << "\\nWhat is the list name?" << endl;
   string name;
   getline(cin, name);
   if (listOfLists.contains(name))
   {
      cout << "List already exists.";
      return;
   }
   listOfLists[name] = {};
   bool done = false;
   while (!done)
   {
      displayCurrentList(name);
      addMenu.DisplayMenu();
      string option = getCurrentOption();
      done = runAddMenu(name, option);
   }
}

void displayCurrentList(const string &name)
{
   cout << "\\nCurrent contents of " << name << ":" << endl;
   int count = 1;
   for (string item: listOfLists.at(name))
   {
      cout << count << ". " << item << endl;
      count++;
   }
}

bool runAddMenu(const string &name, const string &option)
{
   if (option == "1")
   {
      addItem(name);
   }
   else if (option == "2")
   {
      return true;
   }
   return false;
}

void addItem(const string &name)
{
   cout << "What would you like to add to " << name << "?" << endl;
   string item = getCurrentOption();
   listOfLists[name].emplace_back(item);
}` },
  { name: 'Menu.h', language: 'cpp', group: 'C++', code: `//
// Created by bradl on 11/1/2022.
//
#include <iostream>
#include <vector>

#ifndef LISTOFLISTSCPP_MENU_H
#define LISTOFLISTSCPP_MENU_H

using namespace std;

class Menu
{
protected:
   vector<string> menu;

public:
   Menu(vector<string>);

   void DisplayMenu();
};


#endif //LISTOFLISTSCPP_MENU_H` },
  { name: 'Menu.cpp', language: 'cpp', group: 'C++', code: `//
// Created by bradl on 11/1/2022.
//

#include "Menu.h"

Menu::Menu(vector<string> newMenu)
{
   menu = newMenu;
}

void Menu::DisplayMenu()
{
   for (const auto &item: menu)
      cout << item << endl;
}` },
  { name: 'json.hpp', language: 'text', group: 'C++', code: 'See: https://github.com/nlohmann/json' },
  { name: 'main.rs', language: 'rust', group: 'Rust', code: `// Author: Bradley Hunter

use std::io;
use std::num::ParseIntError;
use std::collections::HashMap;

fn main() {
    let mut list_of_lists = ListOfLists::new();
    list_of_lists.run();
}

pub struct ListOfLists {
    list_of_lists: HashMap<String, Vec<String>>
}

impl ListOfLists{

    pub fn new() -> ListOfLists {
        ListOfLists {
            list_of_lists : HashMap::new()
        }
    }

    pub fn run(&mut self) {
        let mut done = false;
        while !done {
            self.display_main_menu();
            let option = self.get_int_option();
            done = self.run_main_menu(option);
        }
    }

    fn get_int_option(&self) -> i32  {
        loop {
            let num = self.get_input_num();
            match num {
                Ok(_int) => return num.unwrap(),
                Err(_) => {
                    println!("Input a valid number.")
                },
            }
        }
    }

    fn get_string_option(&self) -> String {
        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Failed to read line");
        let output = input.trim().to_string();
        output
    }

    fn get_input_num(&self) -> Result<i32, ParseIntError> {
        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Failed to read line");
        let output = input.trim().parse::<i32>()?;
        Ok(output)
    }

    fn display_main_menu(&self) {
        let menu_list = vec!["\\n", "Main Menu", "--------------", "1. Add List", "2. View List", "3. Delete List", "4. Quit/Save"];
        for row in menu_list {
            println!("{}", row);
        }
    }

    fn display_add_menu(&self) {
        let menu_list = vec!["\\n", "Add List Menu", "--------------", "1. Add Item", "2. Quit"];
        for row in menu_list {
            println!("{}", row);
        }
    }

    fn display_view_menu(&self) {
        let menu_list = vec!["\\n", "List Options", "--------------", "1. Add Item", "2. Remove Item", "3. Quit"];
        for row in menu_list {
            println!("{}", row);
        }
    }

    fn view_list(&mut self) {
        self.display_list_of_lists();
        let quit_spot = self.list_of_lists.len() + 1;
        println!("{}. Quit", quit_spot);
        let mut valid_option = false;
        let mut name = self.get_string_option();
        let mut first_run = true;
        while !valid_option {
            if !first_run {
                name = self.get_string_option();
            }
            if self.list_of_lists.contains_key(&name) {
                self.display_current_list(&name);
                valid_option = true;
            } else if name.to_lowercase() == "quit" {
                return
            } else {
                println!("Invalid Option.");
            }
            first_run = false;
        }
        first_run = true;
        let mut done = false;
        while !done {
            if !first_run {
                self.display_current_list(&name);
            } else {
                first_run = false;
            }
            self.display_view_menu();
            let option = self.get_int_option();
            done = self.run_view_menu(&name, option);
        }
    }

    fn run_main_menu(&mut self, option: i32) -> bool {
        if option == 1 {
            self.add_list();
        } else if option == 2 {
            self.view_list();
        } else if option == 3 {
            self.delete_list();
        } else if option == 4 {
            return true
        }
        false
    }

    fn delete_list(&mut self) {
        self.display_list_of_lists();
        println!("Which list should be deleted?");
        let option = self.get_string_option();
        println!("Are you sure you want to delete the list? (y/n)");
        let check = self.get_string_option();
        if check.to_lowercase() == "y" {
            self.list_of_lists.remove(&option);
        } else {
            println!("No Longer deleting {}", option);
        }
    }

    fn display_list_of_lists(&self) {
        println!("List of Lists:");
        let mut count = 1;
        for list in self.list_of_lists.keys() {
            println!("{}. {}", count, list);
            count += 1;
        }
    }

    fn run_view_menu(&mut self, name: &String, option: i32) -> bool {
        if option == 1 {
            self.add_item(name);
        } else if option == 2 {
            self.remove_item(name);
        } else {
            return true
        }
        false
    }

    fn remove_item(&mut self, name: &String) {
        println!("What number of item should be removed?");
        let item = self.get_int_option();
        let mut new_list = self.list_of_lists.get(name).expect("Unable to find list.").clone();
        new_list.remove((item - 1) as usize);
        self.list_of_lists.insert(name.to_string(), new_list);
    }

    fn add_list(&mut self) {
        println!("What is the list name?");
        let name = self.get_string_option();
        if self.list_of_lists.contains_key(name.as_str()) {
            println!("List already exists.");
            return
        }
        self.list_of_lists.insert(name.clone(), Vec::new());
        let mut done = false;
        while !done {
            self.display_current_list(&name);
            self.display_add_menu();
            let option = self.get_int_option();
            done = self.run_add_menu(&name, option);
        }
    }

    fn display_current_list(&self, name: &String) {
        println!("Current contents of {}:", name);
        let mut count = 1;
        for item in self.list_of_lists.get(name).unwrap() {
            println!("{}. {}", count, item);
            count += 1;
        }
    }

    fn run_add_menu(&mut self, name: &String, option: i32) -> bool{
        if option == 1 {
            self.add_item(name);
        } else if option == 2 {
            return true;
        }
        return false;
    }

    fn add_item(&mut self, list: &String) {
        print!("Enter an item to add to {}:", &list);
        let item = self.get_string_option();
        let mut new_list = self.list_of_lists.get(list).expect("Unable to find list").clone();
        new_list.push(item.clone());
        self.list_of_lists.insert(list.to_string(), new_list);
    }
}` },
]
