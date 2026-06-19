#include "galaxia/Communicator.h"
#include <iostream>

using namespace Galaxia;

Communicator::Communicator(): running_(false) {}

Communicator::~Communicator() { if (running_) stop(); }

void Communicator::start() {
    running_ = true;
    std::cout << "[Communicator] started (stub)" << std::endl;
}

void Communicator::stop() {
    running_ = false;
    std::cout << "[Communicator] stopped" << std::endl;
}

void Communicator::sendMessage(const std::string &msg) {
    if (!running_) {
        std::cout << "[Communicator] not running. Can't send." << std::endl;
        return;
    }
    std::cout << "[Communicator] send: " << msg << std::endl;
}

std::string Communicator::receiveMessage() {
    if (!running_) return "";
    // stub: in a real app this would block or poll a queue
    return "no messages (stub)";
}
