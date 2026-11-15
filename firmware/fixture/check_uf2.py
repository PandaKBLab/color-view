"""Check that the UF2 targets the nice!nano v2 bootloader's app partition."""
import struct
import sys
from pathlib import Path


def verify(data):
    block_size = 512
    if not data or len(data) % block_size:
        raise ValueError("Invalid UF2 size")
    block_count = len(data) // block_size
    addresses = set()
    numbers = set()
    for offset in range(0, len(data), block_size):
        block = data[offset:offset + block_size]
        magic0, magic1, flags, address, length, number, count, family = struct.unpack_from(
            "<8I", block
        )
        if (magic0, magic1, struct.unpack_from("<I", block, 508)[0]) != (
            0x0A324655, 0x9E5D5157, 0x0AB16F30
        ):
            raise ValueError("Invalid UF2 block magic")
        if not flags & 0x2000 or family != 0xADA52840:
            raise ValueError("UF2 is missing the nRF52840 family identifier")
        if not 0 < length <= 476 or not 0x26000 <= address < address + length <= 0xEC000:
            raise ValueError(f"UF2 block outside app partition: 0x{address:08x}")
        if count != block_count or number >= count or number in numbers:
            raise ValueError("Invalid UF2 block numbering")
        addresses.add(address)
        numbers.add(number)
    if min(addresses) != 0x26000 or len(addresses) != block_count:
        raise ValueError("Invalid UF2 start address or duplicate target blocks")
    print(f"Verified {block_count} nRF52840 UF2 blocks in the app partition")


if __name__ == "__main__":
    verify(Path(sys.argv[1]).read_bytes())
