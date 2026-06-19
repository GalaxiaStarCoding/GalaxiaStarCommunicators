#include <cassert>
#include "galaxia/Communicator.h"

int main() {
    Galaxia::Communicator c;
    c.start();
    c.sendMessage("test");
    auto r = c.receiveMessage();
    c.stop();
    assert(r.size() >= 0);
    return 0;
}
