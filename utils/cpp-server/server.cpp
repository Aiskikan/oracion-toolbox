//powered by cpp-httplib https://github.com/yhirose/cpp-httplib

//author:Aiskikan
#include"winsock2.h" 
#include "httplib.h"
#include <windows.h>
#include <iostream>
const char* hello = R"(=======AiskHttpServer======
AiskHttpServer is a lightweight http server for C++
Author:Aiskikan
Version:1.0
==========================)";
int main(void) {
	using namespace httplib;
	using namespace std;
	Server svr;
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE);
	cout << hello << endl;
	SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN);

	auto ret = svr.set_mount_point("/", "./www");
	if (!ret) {
		SetConsoleTextAttribute(hConsole, FOREGROUND_RED);
		printf("Error:mount point error './www'!\n");
		SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE);

		return -1;
	}
	svr.set_logger([&](const Request& req, const Response& res) {
		if (res.status >= 200 && res.status < 300) {
			SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN);
		}
		else {
			SetConsoleTextAttribute(hConsole, FOREGROUND_RED);
		}
		printf("[%s] %s %d\n", req.method.c_str(), req.path.c_str(), res.status);
		SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN);
		});
	SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN);
	printf("The website will listen on http://127.0.0.1:3000\n");
	SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN);

	svr.listen("0.0.0.0", 3000);
}
